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
					productCost: product.cost,
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
						productCost: true,
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
			where: {
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
						productCost: true,
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

// Dashboard related function & api to analytics
app.get("/stat/card", checkSignIn, async (req, res) => {
	try {
		const totalOrders = await prisma.order.count();
		const ordersByStatus = await prisma.order.groupBy({
			by: ["status"],
			_count: true,
		});

		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const todayOrders = await prisma.order.count({
			where: {
				orderDate: {
					gte: today,
				},
			},
		});

		res.status(200).json({
			totalOrders,
			ordersByStatus,
			todayOrders,
		});
	} catch (error) {
		console.error("Error fetching order statistics:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

app.get("/stat/financial", checkSignIn, async (req, res) => {
	try {
		// 1. Calculate Total Income
		const totalIncomeResult = await prisma.order.aggregate({
			_sum: { orderTotal: true },
			where: {
				status: {
					in: ["In Progress", "Shipped", "Completed"],
				},
			},
		});

		const totalIncome = totalIncomeResult._sum.orderTotal || 0;

		// 2. Calculate Total Profit
		const profitResult = await prisma.productOnOrder.findMany({
			where: {
				order: {
					status: {
						in: ["In Progress", "Shipped", "Completed"],
					},
				},
			},
		});

		const totalProfit = profitResult.reduce((acc, item) => {
			const { productPrice, productCost, quantity } = item;
			return acc + (productPrice - productCost) * quantity;
		}, 0);

		// Return response
		res.status(200).json({
			totalIncome,
			totalProfit,
		});
	} catch (error) {
		console.error("Error fetching financial statistics:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

app.get("/stat/incomeProfitMonthly", checkSignIn, async (req, res) => {
	try {
		const year = new Date().getFullYear();
		if (!year || isNaN(year)) {
			return res.status(400).json({ error: "Invalid year parameter" });
		}

		const startDate = new Date(`${year}-01-01T00:00:00Z`);
		const endDate = new Date(`${year}-12-31T23:59:59Z`);

		// Calculate monthly income (sum of orderTotal from Order table)
		const incomeData = await prisma.order.findMany({
			where: {
				status: {
					in: ["In Progress", "Shipped", "Completed"],
				},
				orderDate: {
					gte: startDate,
					lte: endDate,
				},
			},
			select: {
				orderTotal: true,
				orderDate: true,
			},
		});

		const monthlyIncome = Array(12).fill(0);
		incomeData.forEach((order) => {
			const month = new Date(order.orderDate).getMonth();
			monthlyIncome[month] += order.orderTotal || 0;
		});

		// Calculate monthly profit
		const profitData = await prisma.productOnOrder.findMany({
			where: {
				order: {
					status: {
						in: ["In Progress", "Shipped", "Completed"],
					},
					orderDate: {
						gte: startDate,
						lte: endDate,
					},
				},
			},
			select: {
				quantity: true,
				productPrice: true,
				productCost: true,
				order: {
					select: {
						orderDate: true,
					},
				},
			},
		});

		const monthlyProfit = Array(12).fill(0);
		profitData.forEach((item) => {
			const month = new Date(item.order.orderDate).getMonth(); // Get month (0-11)
			const profitPerItem = (item.productPrice - item.productCost) * item.quantity;
			monthlyProfit[month] += profitPerItem;
		});

		const results = {
			year,
			monthlyIncome, // [January Income, February Income, ...]
			monthlyProfit, // [January Profit, February Profit, ...]
		};

		res.status(200).json({results: results});
	} catch (error) {
		console.error("Error fetching income and profit statistics:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

app.get('/stat/orderMonthly', checkSignIn, async (req, res) => {
    try {
        const year = new Date().getFullYear();
        const orders = await prisma.order.findMany({
            where: {
                orderDate: {
                    gte: new Date(`${year}-01-01`),
                    lt: new Date(`${year + 1}-01-01`),
                },
            },
            select: {
                orderDate: true,
            },
        });

        const monthlyOrders = Array(12).fill(0);

        // Count orders for each month
        orders.forEach((order) => {
            const month = new Date(order.orderDate).getMonth();
            monthlyOrders[month] += 1;
        });

        res.json({
            year,
            monthlyOrders,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch monthly orders' });
    }
});


app.post("/mockUpOrderCreate", checkSignIn, async (req, res) => {
	
});




module.exports = app;