const express = require("express");
const app = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { format } = require("date-fns");

dotenv.config();

const { checkSignIn } = require("../middleware/auth");

app.post("/orderCreate", checkSignIn, async (req, res) => {
    
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
			orderDate: format(new Date(order.orderDate), "yyyy-MM-dd HH:mm:ss"),
            paymentDate: order.paymentDate ? format(new Date(order.paymentDate), "yyyy-MM-dd HH:mm:ss") : null,
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

module.exports = app;
