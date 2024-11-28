const express = require("express");
const app = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const dotenv = require("dotenv");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const ifIsImage = require("if-is-image");

dotenv.config();

const { checkSignIn } = require("../middleware/auth");

app.use(fileUpload());

app.post("/orderCreate", checkSignIn, async (req, res) => {
	try {
		console.log("/orderCreate req.body", req.body);
		// Extract user ID from the authenticated session
		const userId = req.user.id;

		// Validate request body
		const { orderItems, address, phone } = req.body;
		if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
			return res.status(400).send({ error: "Invalid or missing order items" });
		}
		if (!address || !phone) {
			return res.status(400).send({ error: "Address and phone are required" });
		}

		// Prepare orderTotal and validate product availability
		let orderTotal = 0;

		// Validate and calculate total
		const validatedItems = await Promise.all(
			orderItems.map(async (item) => {
				const product = await prisma.product.findUnique({
					where: { id: item.productId },
				});

				if (!product || product.quantity < item.quantity) {
					throw new Error(`Product ${item.productId} is unavailable or insufficient in stock`);
				}

				// Add to total price
				orderTotal += product.price * item.quantity;

				// Return validated item for further processing
				return {
					productId: item.productId,
					productPrice: product.price,
					quantity: item.quantity,
				};
			})
		);

		// Create the order
		const newOrder = await prisma.order.create({
			data: {
				userId: userId,
				orderTotal: orderTotal,
				address: address,
				phone: phone,
				orderItems: {
					create: validatedItems,
				},
			},
			include: {
				orderItems: true,
			},
		});

		// Update product quantities
		await Promise.all(
			validatedItems.map(async (item) => {
				await prisma.product.update({
					where: { id: item.productId },
					data: {
						quantity: { decrement: item.quantity },
					},
				});
			})
		);

		// Delete ProductOnCart entries for the user
		await prisma.productOnCart.deleteMany({
			where: {
				userId: userId,
				productId: { in: validatedItems.map((item) => item.productId) },
			},
		});

		// Update cartQty and cartTotal for the user
		await prisma.user.update({
			where: { id: userId },
			data: {
				cartQty: 0,
				cartTotal: 0,
			},
		});

		res.status(200).send({ message: "Order created successfully", newOrder: newOrder });
	} catch (e) {
		console.error("Error creating order:", e);
		res.status(500).send({ error: e.message });
	}
});

app.get("/orderList", checkSignIn, async (req, res) => {
	try {
		const orderList = await prisma.order.findMany({
			orderBy: {
				id: "desc",
			},
			include: {
				user: {
					select: {
						name: true,
					},
				},
				orderItems: {
					select: {
						productId: true,
						productPrice: true,
						quantity: true,
						product: {
							include: {
								author: true,
								categories: {
									include: {
										category: true,
									},
								},
							},
						},
					},
				},
			},
		});

		const transOrderList = orderList.map((order) => ({
			...order,
			paymentDate: order.paymentDate ? order.paymentDate : null,
			userName: order.user.name,
			user: undefined, // Remove original user key
			orderItems: order.orderItems.map((item) => ({
				...item,
				totalPrice: item.productPrice * item.quantity, // Add totalPrice key
				name: item.product.name,
				img: item.product.img,
				desc: item.product.desc,
				author: item.product.author.name,
				categoriesName: item.product.categories.map((pc) => pc.category.name),
				product: undefined, // Remove original product key
			})),
		}));

		res.send({ results: transOrderList });
	} catch (e) {
		res.status(500).send({ error: e.message });
	}
});

app.put("/orderUpdate", checkSignIn, async (req, res) => {
	try {
		// Delete old paymentSlip image
		const oldData = await prisma.order.findFirst({
			select: {
				paymentSlipIMG: true,
			},
			where: {
				id: parseInt(req.body.id),
			},
		});
		if (req.body.deleteIMG) {
			if (fs.existsSync("./uploads/payment_slip_img/" + oldData.img)) {
				await fs.unlinkSync("./uploads/payment_slip_img/" + oldData.img); // Delete old file
			}
		}

		await prisma.order.update({
			data: {
				status: req.body.status,
				statusDetail: req.body.statusDetail,
				paymentDate: req.body.paymentDate,
				paymentSlipIMG: req.body.paymentSlipIMG,
				parcelCode: req.body.parcelCode,
				address: req.body.address,
				phone: req.body.phone,
			},
			where: {
				id: req.body.id,
			},
		});

		res.send({ message: "success" });
	} catch (e) {
		console.log("Error: Order update", e);
		res.status(500).send({ error: e.message });
	}
});

app.post("/uploadPaymentSlip", checkSignIn, async (req, res) => {
	try {
		if (req.files != undefined && req.files.img != undefined && ifIsImage(req.files.img.name)) {
			const img = req.files.img;
			const myDate = new Date();
			const y = myDate.getFullYear();
			const m = myDate.getMonth() + 1;
			const d = myDate.getDate();
			const h = myDate.getHours();
			const mi = myDate.getMinutes();
			const s = myDate.getSeconds();
			const ms = myDate.getMilliseconds();

			const arrFileName = img.name.split(".");
			const ext = arrFileName[arrFileName.length - 1];

			const newName = `${y}${m}${d}${h}${mi}${s}${ms}.${ext}`;

			img.mv("./uploads/payment_slip_img/" + newName, (err) => {
				if (err) throw err;
				res.send({ newName: newName });
			});
		} else {
			res.send({ newName: null });
		}
	} catch (e) {
		res.status(500).send({ error: e.message, newName: null });
	}
});

app.get("/myOrderList", checkSignIn, async (req, res) => {
	try {
		const userId = req.user.id;

		const orderList = await prisma.order.findMany({
			where:{
				userId: userId,
			},
			orderBy: {
				id: "desc",
			},
			include: {
				user: {
					select: {
						name: true,
					},
				},
				orderItems: {
					select: {
						productId: true,
						productPrice: true,
						quantity: true,
						product: {
							include: {
								author: true,
								categories: {
									include: {
										category: true,
									},
								},
							},
						},
					},
				},
			},
		});

		const transOrderList = orderList.map((order) => ({
			...order,
			paymentDate: order.paymentDate ? order.paymentDate : null,
			name: order.user.name,
			user: undefined, // Remove original user key
			orderItems: order.orderItems.map((item) => ({
				...item,
				totalPrice: item.productPrice * item.quantity, // Add totalPrice key
				name: item.product.name,
				img: item.product.img,
				desc: item.product.desc,
				author: item.product.author.name,
				categoriesName: item.product.categories.map((pc) => pc.category.name),
				product: undefined, // Remove original product key
			})),
		}));

		res.send({ results: transOrderList });
	} catch (e) {
		res.status(500).send({ error: e.message });
	}
});

module.exports = app;