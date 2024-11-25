const express = require("express");
const app = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const dotenv = require("dotenv");
const fileUpload = require("express-fileupload");
const fs = require("fs");
// const exceljs = require('exceljs');
const ifIsImage = require("if-is-image");

dotenv.config();

const { checkSignIn } = require("../middleware/auth");

app.use(fileUpload());

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


app.get("/public/search", async (req, res) => {
    try {
        const { name, author, minPrice, maxPrice } = req.query;
        
        // Build base query conditions
        const where = {
            status: "use"
        };

        // Add name search if provided
        if (name) {
            where.OR = [
                { name: { contains: name } }
            ];
            // Include description search if desc exists
            where.OR.push({ desc: { contains: name } });
        }

        // Add price range if provided
        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) where.price.gte = parseInt(minPrice);
            if (maxPrice) where.price.lte = parseInt(maxPrice);
        }

        // Add author filter if provided
        if (author) {
            where.AND = where.AND || [];
            where.AND.push({
                author: {
                    name: { contains: author }
                }
            });
        }

        // Fetch products with given conditions
        const products = await prisma.product.findMany({
            where,
            orderBy: {
                id: 'desc'
            },
            include: {
                author: {
                    select: {
                        name: true
                    }
                },
                categories: {
                    include: {
                        category: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }
            }
        });

        // Format the response
        const results = products.map(product => ({
            id: product.id,
            name: product.name,
            price: product.price,
            img: product.img,
            desc: product.desc,
            quantity: product.quantity,
            author: product.author.name,
            categories: product.categories.map(pc => pc.category.id),
            categoriesName: product.categories.map(pc => pc.category.name)
        }));

        // Send consistent response format
        res.json({
            status: 'success',
            results: results
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

app.put("/update", checkSignIn, async (req, res) => {
	try {
		const errorList = [];
		if (!req.body.name) errorList.push("name");
		if (!req.body.cost || req.body.cost < 0) errorList.push("cost");
		if (!req.body.price || req.body.price < 0) errorList.push("price");
		if (!req.body.quantity || req.body.quantity < 0) errorList.push("quantity");
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


// app.post('/uploadFromExcel', checkSignIn, (req, res) => {
//     try {
//         const fileExcel = req.files.fileExcel;

//         fileExcel.mv('./uploads/products_sheet/' + fileExcel.name, async (err) => {
//             if (err) throw err;

//             const workbook = new exceljs.Workbook();
//             await workbook.xlsx.readFile('./uploads/products_sheet/' + fileExcel.name);

//             const ws = workbook.getWorksheet(1);

//             for (let i = 2; i <= ws.rowCount; i++) {
//                 const name = ws.getRow(i).getCell(1).value ?? ""; //if null or undefined return ""
//                 const cost = ws.getRow(i).getCell(2).value ?? 0; //if null or undefined return 0
//                 const price = ws.getRow(i).getCell(3).value ?? 0;

//                 if (name != "" && cost >= 0 && price >= 0) {
//                     await prisma.product.create({
//                         data: {
//                             name: name,
//                             cost: cost,
//                             price: price,
//                             img: "noIMGFile"
//                         }
//                     })
//                 }
//             }
//             //remove sheet file after read
//             const fs = require('fs');
//             await fs.unlinkSync('./uploads/products_sheet/' + fileExcel.name);

//             res.send({ message: 'success' });
//         })
//     } catch (e) {
//         res.status(500).send({ error: e.message });
//     }
// })

// Cart related api

// Get user's cart items

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
            author: cartItem.product.author.name,
            categories: cartItem.product.categories.map((pc) => pc.categoryId),
            categoriesName: cartItem.product.categories.map((pc) => pc.category.name),
        }));

        // Get the total quantity for the cart badge
        const cartQty = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        const cartTotal = cartItems.reduce((sum, item) => sum + (item.quantity * item.product.price), 0);

        // Update user's cart summary
        await prisma.user.update({
            where: { id: req.user.id },
            data: { 
                cartQty,
                cartTotal
            }
        });

        res.send({ 
            results,
            cartQty,
            cartTotal
        });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

// Add item to cart
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
            include: { product: true }
        });

        const cartQty = updatedCart.reduce((sum, item) => sum + item.quantity, 0);
        const cartTotal = updatedCart.reduce((sum, item) => sum + (item.quantity * item.product.price), 0);

        await prisma.user.update({
            where: { id: req.user.id },
            data: { 
                cartQty,
                cartTotal
            }
        });

        res.send({ 
            message: "Added to cart",
            cartQty,
            cartTotal
        });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

// Update cart item quantity
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
            include: { product: true }
        });

        const cartQty = updatedCart.reduce((sum, item) => sum + item.quantity, 0);
        const cartTotal = updatedCart.reduce((sum, item) => sum + (item.quantity * item.product.price), 0);

        await prisma.user.update({
            where: { id: req.user.id },
            data: { 
                cartQty,
                cartTotal
            }
        });

        res.send({ 
            message: "Cart updated",
            cartQty,
            cartTotal
        });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

// Remove item from cart
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
            include: { product: true }
        });

        const cartQty = updatedCart.reduce((sum, item) => sum + item.quantity, 0);
        const cartTotal = updatedCart.reduce((sum, item) => sum + (item.quantity * item.product.price), 0);

        await prisma.user.update({
            where: { id: req.user.id },
            data: { 
                cartQty,
                cartTotal
            }
        });

        res.send({ 
            message: "Item removed from cart",
            cartQty,
            cartTotal
        });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

module.exports = app;
