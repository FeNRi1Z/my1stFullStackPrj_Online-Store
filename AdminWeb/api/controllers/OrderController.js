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
						product: {
							select: {
								name: true,
                                img: true,
							},
						},
						productPrice: true,
						quantity: true,
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
				productName: item.product.name,
                productImg: item.product.img,
				product: undefined, // Remove original product key
			})),
		}));

		res.send({ results: transOrderList });
	} catch (e) {
		res.status(500).send({ error: e.message });
	}
});

module.exports = app;
