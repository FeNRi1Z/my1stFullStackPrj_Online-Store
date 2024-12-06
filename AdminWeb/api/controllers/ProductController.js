const express = require("express");
const app = express.Router();
const fileUpload = require("express-fileupload");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const dotenv = require("dotenv");
const fs = require("fs");
const ifIsImage = require("if-is-image");

const { checkSignIn } = require("../middleware/auth");

dotenv.config();

// File upload middleware
app.use(fileUpload());
// Product create endpoint for admins
app.post("/create", checkSignIn, async (req, res) => {
	try {
		const errorList = [];
		if (!req.body.name) errorList.push("name");
		if (!req.body.cost || req.body.cost < 0) errorList.push("cost");
		if (!req.body.price || req.body.price < 0) errorList.push("price");
		if (!req.body.quantity || req.body.quantity < 0) errorList.push("quantity");
		if (!req.body.authorId) errorList.push("author");
		if (!req.body.categoriesId) errorList.push("category");
		console.log("errorList: ", errorList);
		if (errorList.length > 0) return res.status(410).send({ errorList: errorList });

		const productResult = await prisma.product.create({
			data: {
				name: req.body.name,
				desc: req.body.desc,
				authorId: parseInt(req.body.authorId) || 1,
				cost: parseInt(req.body.cost),
				price: parseInt(req.body.price),
				quantity: parseInt(req.body.quantity) || 0,
				img: req.body.img || "noIMGFile",
			},
		});
		console.log("Create productResult: ", productResult);

		await prisma.productCategory.createMany({
			data: req.body.categoriesId.map((categoryId) => ({
				productId: parseInt(productResult.id),
				categoryId: parseInt(categoryId),
			})),
		});

		res.send({ message: "success" });
	} catch (e) {
		if (req.body.img && req.body.img !== "noIMGFile") {
			try {
				await fs.promises.unlink(`./uploads/product_img/${req.body.img}`);
			} catch (fileError) {
				console.error("Failed to delete file:", fileError);
			}
		}
		res.status(500).send({ error: e.message });
	}
});
// Product list endpoint for admins
app.get("/list", checkSignIn, async (req, res) => {
	try {
		const data = await prisma.product.findMany({
			orderBy: {
				id: "desc",
			},
			where: {
				status: "use",
			},
			include: {
				author: true,
				categories: {
					include: {
						category: true,
					},
				},
			},
		});

		const results = data.map((product) => ({
			...product,
			author: product.author.name,
			categories: product.categories.map((pc) => pc.categoryId),
			categoriesName: product.categories.map((pc) => pc.category.name),
		}));

		res.send({ results });
	} catch (e) {
		res.status(500).send({ error: e.message });
	}
});
// Product update endpoint for admins
app.put("/update", checkSignIn, async (req, res) => {
	try {
		const errorList = [];
		if (!req.body.name) errorList.push(name);
		if (!req.body.cost || req.body.cost < 0) errorList.push("cost");
		if (!req.body.price || req.body.price < 0) errorList.push("price");
		if (req.body.quantity < 0) errorList.push("quantity");
		if (!req.body.authorId) errorList.push("author");
		if (!req.body.categoriesId) errorList.push("category");
		console.log("errorList: ", errorList);
		if (errorList.length !== 0) return res.status(410).send({ errorList: errorList });

		// Delete old product image
		const oldData = await prisma.product.findFirst({
			select: {
				img: true,
			},
			where: {
				id: parseInt(req.body.id),
			},
		});
		if (req.body.deleteIMG) {
			if (fs.existsSync("./uploads/product_img/" + oldData.img)) {
				await fs.unlinkSync("./uploads/product_img/" + oldData.img); // Delete old file
			}
		}

		await prisma.product.update({
			data: {
				name: req.body.name,
				desc: req.body.desc,
				authorId: parseInt(req.body.authorId) || 1,
				cost: parseInt(req.body.cost),
				price: parseInt(req.body.price),
				quantity: parseInt(req.body.quantity) || 0,
				img: req.body.img || "noIMGFile",
			},
			where: {
				id: parseInt(req.body.id),
			},
		});

		await prisma.productCategory.deleteMany({
			where: {
				productId: parseInt(req.body.id),
			},
		});

		await prisma.productCategory.createMany({
			data: req.body.categoriesId.map((categoryId) => ({
				productId: parseInt(req.body.id),
				categoryId: parseInt(categoryId),
			})),
		});

		res.send({ message: "success" });
	} catch (e) {
		res.status(500).send({ error: e.message });
	}
});
// Product delete endpoint for admins
app.delete("/remove/:id", checkSignIn, async (req, res) => {
	try {
		await prisma.product.update({
			data: {
				status: "delete",
			},
			where: {
				id: parseInt(req.params.id),
			},
		});

		res.send({ message: "success" });
	} catch (e) {
		res.status(500).send({ error: e.message });
	}
});
// fetch author list
app.get("/authors", checkSignIn, async (req, res) => {
	try {
		const data = await prisma.author.findMany({
			orderBy: {
				id: "asc",
			},
		});

		res.send({ results: data });
	} catch (e) {
		res.status(500).send({ error: e.message });
	}
});
// create author in create product for admins
app.post("/createAuthor", checkSignIn, async (req, res) => {
	try {
		const errorList = [];
		if (!req.body) errorList.push("author");
		if (errorList.length !== 0) return res.status(410).send({ errorList: errorList });

		const result = await prisma.author.create({
			data: { name: req.body.name },
		});

		res.send({
			message: "success",
			authorId: result.id,
		});
	} catch (e) {
		res.status(500).send({ error: e.message });
	}
});
// fetch category list for admin and clients
app.get("/categories", checkSignIn, async (req, res) => {
	try {
		const data = await prisma.category.findMany({
			orderBy: {
				id: "asc",
			},
		});

		res.send({ results: data });
	} catch (e) {
		res.status(500).send({ error: e.message });
	}
});
// create category in create product for admins
app.post("/createCategory", checkSignIn, async (req, res) => {
	try {
		const errorList = [];
		if (!req.body) errorList.push("category");
		if (errorList.length !== 0) return res.status(410).send({ errorList: errorList });

		data = req.body.name.map((name) => ({ name: name }));

		await prisma.category.createMany({
			data: data,
		});

		const result = await prisma.category.findMany({
			where: {
				name: { in: req.body.name },
			},
		});

		res.send({
			message: "success",
			categoryId: result.map((r) => r.id),
		});
	} catch (e) {
		res.status(500).send({ error: e.message });
	}
});
// Upload product image endpoint for admins
app.post("/upload", checkSignIn, async (req, res) => {
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

			img.mv("./uploads/product_img/" + newName, (err) => {
				if (err) throw err;
				res.send({ newName: newName });
			});
		} else {
			res.send({ newName: "noIMGFile" });
		}
	} catch (e) {
		res.status(500).send({ error: e.message, newName: "noIMGFile" });
	}
});

/* Client Web zone */

// Cart items list endpoint for clients
app.get("/cart/items", checkSignIn, async (req, res) => {
	try {
		const cartItems = await prisma.productOnCart.findMany({
			where: {
				userId: req.user.id,
			},
			include: {
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
		});

		const results = cartItems.map((cartItem) => ({
			id: cartItem.product.id,
			name: cartItem.product.name,
			price: cartItem.product.price,
			img: cartItem.product.img,
			desc: cartItem.product.desc,
			quantity: cartItem.quantity,
			maxQuantity: cartItem.product.quantity,
			author: cartItem.product.author.name,
			categories: cartItem.product.categories.map((pc) => pc.categoryId),
			categoriesName: cartItem.product.categories.map((pc) => pc.category.name),
		}));

		// Get the total quantity for the cart badge
		const cartQty = cartItems.reduce((sum, item) => sum + item.quantity, 0);
		const cartTotal = cartItems.reduce((sum, item) => sum + item.quantity * item.product.price, 0);

		// Update user's cart summary
		await prisma.user.update({
			where: { id: req.user.id },
			data: {
				cartQty,
				cartTotal,
			},
		});

		res.send({
			results,
			cartQty,
			cartTotal,
		});
	} catch (e) {
		res.status(500).send({ error: e.message });
	}
});
// Product list endpoint for clients
app.get("/public/list", async (req, res) => {
	try {
		const data = await prisma.product.findMany({
			orderBy: {
				id: "desc",
			},
			where: {
				status: "use",
			},
			include: {
				author: true,
				categories: {
					include: {
						category: true,
					},
				},
			},
		});

		const results = data.map((product) => ({
			...product,
			author: product.author.name,
			categories: product.categories.map((pc) => pc.categoryId),
			categoriesName: product.categories.map((pc) => pc.category.name),
		}));

		res.send({ results });
	} catch (e) {
		res.status(500).send({ error: e.message });
	}
});
// Product search endpoint for clients
app.get("/public/search", async (req, res) => {
    try {
        console.log('Received search request with query params:', req.query);
        
        const { name, author, minPrice, maxPrice, categories } = req.query;

        // Build base query conditions
        const where = {
            status: "use",
        };

        // Add name search if provided
        if (name) {
            where.OR = [
                { name: { contains: name } },
                { desc: { contains: name } }
            ];
        }

		// Add price range if provided
		if (minPrice || maxPrice) {
			where.price = {};
			if (minPrice) where.price.gte = parseInt(minPrice);
			if (maxPrice) where.price.lte = parseInt(maxPrice);
		}

        // Add author filter if provided
        if (author) {
            where.author = {
                name: { contains: author }
            };
        }

        // Add category filter - key change here
        if (categories) {
            where.categories = {
                some: {
                    category: {
                        name: {
                            // Handle both single category and array of categories
                            in: Array.isArray(categories) ? categories : [categories]
                        }
                    }
                }
            };
        }

        console.log('Final where clause:', JSON.stringify(where, null, 2));

        // Fetch products with given conditions
        const products = await prisma.product.findMany({
            where,
            include: {
                author: {
                    select: {
                        name: true
                    }
                },
                categories: {
                    include: {
                        category: true
                    }
                }
            }
        });

        console.log(`Found ${products.length} products matching filters`);

		// Format the response
		const results = products.map((product) => ({
			id: product.id,
			name: product.name,
			price: product.price,
			img: product.img,
			desc: product.desc,
			quantity: product.quantity,
			author: product.author.name,
			categories: product.categories.map((pc) => pc.category.id),
			categoriesName: product.categories.map((pc) => pc.category.name),
		}));

        res.json({
            status: 'success',
            results
        });

    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to search books',
            error: error.message
        });
    }
});
// Add item to cart endpoint for clients
app.post("/cart/add", checkSignIn, async (req, res) => {
	try {
		const { productId, quantity } = req.body;

		// Check if product exists and is in stock
		const product = await prisma.product.findFirst({
			where: {
				id: productId,
				status: "use",
			},
		});

		if (!product) {
			return res.status(404).send({ error: "Product not found" });
		}

		// Update or create cart entry
		await prisma.productOnCart.upsert({
			where: {
				userId_productId: {
					userId: req.user.id,
					productId: productId,
				},
			},
			update: {
				quantity: {
					increment: quantity,
				},
			},
			create: {
				userId: req.user.id,
				productId: productId,
				quantity: quantity,
			},
		});

		// Update user's cart summary
		const updatedCart = await prisma.productOnCart.findMany({
			where: { userId: req.user.id },
			include: { product: true },
		});

		const cartQty = updatedCart.reduce((sum, item) => sum + item.quantity, 0);
		const cartTotal = updatedCart.reduce((sum, item) => sum + item.quantity * item.product.price, 0);

		await prisma.user.update({
			where: { id: req.user.id },
			data: {
				cartQty,
				cartTotal,
			},
		});

		res.send({
			message: "Added to cart",
			cartQty,
			cartTotal,
		});
	} catch (e) {
		res.status(500).send({ error: e.message });
	}
});
// Update cart item endpoint for clients
app.put("/cart/update", checkSignIn, async (req, res) => {
	try {
		const { productId, quantity } = req.body;

		await prisma.productOnCart.update({
			where: {
				userId_productId: {
					userId: req.user.id,
					productId: productId,
				},
			},
			data: {
				quantity: quantity,
			},
		});

		// Update user's cart summary
		const updatedCart = await prisma.productOnCart.findMany({
			where: { userId: req.user.id },
			include: { product: true },
		});

		const cartQty = updatedCart.reduce((sum, item) => sum + item.quantity, 0);
		const cartTotal = updatedCart.reduce((sum, item) => sum + item.quantity * item.product.price, 0);

		await prisma.user.update({
			where: { id: req.user.id },
			data: {
				cartQty,
				cartTotal,
			},
		});

		res.send({
			message: "Cart updated",
			cartQty,
			cartTotal,
		});
	} catch (e) {
		res.status(500).send({ error: e.message });
	}
});
// Remove item from cart endpoint for clients
app.delete("/cart/remove/:productId", checkSignIn, async (req, res) => {
	try {
		await prisma.productOnCart.delete({
			where: {
				userId_productId: {
					userId: req.user.id,
					productId: parseInt(req.params.productId),
				},
			},
		});

		// Update user's cart summary
		const updatedCart = await prisma.productOnCart.findMany({
			where: { userId: req.user.id },
			include: { product: true },
		});

		const cartQty = updatedCart.reduce((sum, item) => sum + item.quantity, 0);
		const cartTotal = updatedCart.reduce((sum, item) => sum + item.quantity * item.product.price, 0);

		await prisma.user.update({
			where: { id: req.user.id },
			data: {
				cartQty,
				cartTotal,
			},
		});

		res.send({
			message: "Item removed from cart",
			cartQty,
			cartTotal,
		});
	} catch (e) {
		res.status(500).send({ error: e.message });
	}
});


/* Dashboard statistic zone */

// Dashboard related function & api to analytics
const getTop10SellingProducts = async () => {
	const currentDate = new Date();
	const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
	const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

	const topProducts = await prisma.productOnOrder.groupBy({
		by: ["productId"],
		_sum: { quantity: true },
		// where: {
		// 	order: {
		// 		orderDate: {
		// 			gte: startOfMonth,
		// 			lte: endOfMonth,
		// 		},
		// 	},
		// },
		orderBy: {
			_sum: { quantity: "desc" },
		},
		take: 10, // Top 10 products
	});

	const productsWithDetails = await Promise.all(
		topProducts.map(async (product) => {
			const productDetails = await prisma.product.findUnique({
				where: { id: product.productId },
			});
			return {
				...productDetails,
				quantitySold: product._sum.quantity,
			};
		})
	);

	return productsWithDetails;
};
// Top selling products endpoint for admins
app.get("/stat/topProduct", checkSignIn, async (req, res) => {
	try {
		const topProducts = await getTop10SellingProducts();

		res.send({ results: topProducts });
	} catch (e) {
		res.status(500).send({ error: e.message });
	}
});
// Product statistics card endpoint for admins
app.get("/stat/card", checkSignIn, async (req, res) => {
	try {
		const totalProducts = await prisma.product.count();
		const activeProducts = await prisma.product.count({ where: { status: "use" } });
		const inactiveProducts = await prisma.product.count({ where: { status: "delete" } });
		const outOfStockProducts = await prisma.product.findMany({ where: { quantity: 0 } });

		res.status(200).json({
			totalProducts,
			activeProducts,
			inactiveProducts,
			outOfStock: outOfStockProducts.length,
			outOfStockProducts: outOfStockProducts.map((product) => product.id),
		});
	} catch (error) {
		console.error("Error fetching product statistics:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

module.exports = app;
