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
			status: "use",
		};

		// Add name search if provided
		if (name) {
			where.OR = [{ name: { contains: name } }];
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
					name: { contains: author },
				},
			});
		}

		// Fetch products with given conditions
		const products = await prisma.product.findMany({
			where,
			orderBy: {
				id: "desc",
			},
			include: {
				author: {
					select: {
						name: true,
					},
				},
				categories: {
					include: {
						category: {
							select: {
								id: true,
								name: true,
							},
						},
					},
				},
			},
		});

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

		// Send consistent response format
		res.json({
			status: "success",
			results: results,
		});
	} catch (error) {
		console.error("Search error:", error);
		res.status(500).json({
			status: "error",
			message: "Failed to search books",
			error: error.message,
		});
	}
});

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

// Dashboard related function & api to analytics
const getTop10SellingProducts = async () => {
	const currentDate = new Date();
	const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
	const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

	const topProducts = await prisma.productOnOrder.groupBy({
		by: ["productId"],
		_sum: { quantity: true },
		where: {
			order: {
				orderDate: {
					gte: startOfMonth,
					lte: endOfMonth,
				},
			},
		},
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

app.get("/stat/topProduct", checkSignIn, async (req, res) => {
	try {
		const topProducts = await getTop10SellingProducts();

		res.send({ results: topProducts });
	} catch (e) {
		res.status(500).send({ error: e.message });
	}
});

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

const books_data = [
	{
		name: "The Catcher in the Rye",
		description:
			"Illustrated by the author’s friend, E. Michael Mitchell, this iconic cover prominently showcases a horse image. It directs the reader’s focus to the significant symbolism of horses woven throughout the novel.",
		author: "J. D. Salinger",
		cost: 250,
		price: 350,
		quantity: 40,
		categories: [5, 12],
	},
	{
		name: "The Divine Comedy",
		description:
			"This appealing book cover signifies Dante’s travels through hell, purgatory, and paradise in an alluring manner. The visuals of hellfire, souls, and free birds very clearly show the three elements. The cover indicates the theme of the poetry within.",
		author: "Dante Alighieri",
		cost: 300,
		price: 450,
		quantity: 30,
		categories: [1, 20],
	},
	{
		name: "Psycho",
		description:
			"Famous book covers having minimalistic typography are not very common. The cover design of this book by Tony Palladino justifies the horror theme of the book through the distressed texture and ‘cut in the middle’ typography.",
		author: "Robert Bloch",
		cost: 280,
		price: 400,
		quantity: 35,
		categories: [6, 18, 25],
	},
	{
		name: "Frankenstein",
		description:
			"Frankenstein has many iconic book covers. One of the best book cover designs is this cover which shows gothic and dark aesthetics featuring the famous monster representing the eerie tone of the book. The scene shows how the monster that Frankenstein created killed his wife.",
		author: "Mary Shelley",
		cost: 320,
		price: 450,
		quantity: 50,
		categories: [2, 27],
	},
	{
		name: "The Great Gatsby",
		description:
			"This cover features the painting of a face floating above New York City lights by the artist Francis Cugat is one of the most celebrated and best book covers in literature. Gatsby’s misplaced idealism is represented by the renowned green light shown in the form of a descending tear.",
		author: "F. Scott Fitzgerald",
		cost: 220,
		price: 300,
		quantity: 45,
		categories: [3, 15],
	},
	{
		name: "The Psychopath Test: A Journey Through the Madness Industry",
		description: "The cover of this 2011-published book depicts the core of the book which is based on the experiment devised to test psychopathic behavior and how the brain works immaculately.",
		author: "Jon Ronson",
		cost: 260,
		price: 380,
		quantity: 20,
		categories: [7, 13],
	},
	{
		name: "Night Shift",
		description:
			"The eerie cover of this book which is a compilation of horror short stories, embraces the book’s scary and unsettling theme. The cover makes it clear to the reader that they are about to embark on a journey into the supernatural and unknown.",
		author: "Stephen King",
		cost: 300,
		price: 420,
		quantity: 25,
		categories: [10, 26],
	},
	{
		name: "River Sing Me Home",
		description:
			"This book cover has beautiful hues of orange, blue, and red with a woman’s silhouette representing the main character of the story, Rachel. Around her are birds, representing freedom, adding a layer of dynamism to the cover.",
		author: "Eleanor Shearer",
		cost: 270,
		price: 400,
		quantity: 30,
		categories: [9, 14, 28],
	},
	{
		name: "Invisible Man",
		description:
			"The first edition of the book cover was designed by Edward McKnight Kauffer in 1952. The cover incorporates a man appearing to be in shadows and darkness while looking at something in the light.",
		author: "Ralph Ellison",
		cost: 240,
		price: 350,
		quantity: 40,
		categories: [8, 22],
	},
	{
		name: "A Teaspoon of Earth and Sea",
		description:
			"One of the most beautiful covers, it portrays the Earth and Sea in pictorial form as mentioned in the title. The female silhouette depicted as a cave or erosion through which the sea can be viewed is a fascinating representation of an Iranian girl who is the center of this story.",
		author: "Dina Nayeri",
		cost: 230,
		price: 310,
		quantity: 50,
		categories: [4, 16],
	},
	{
		name: "A Princess of Mars",
		description:
			"Frank Frazetta designed the captivating book cover of this science-fiction novel. The red backdrop and brown tones clearly show the setting of the planet Mars. Giant green creatures, a beautiful Martian princess, and the lead character John Carter, direct the readers toward the undeniably interesting plot of this book.",
		author: "Edgar Rice Burroughs",
		cost: 250,
		price: 360,
		quantity: 25,
		categories: [3, 21, 31],
	},
	{
		name: "The Unbearable Lightness of Being",
		description:
			"This cover has all the qualities, great book covers have. The philosophical themes, play of light and shadow and the hat picked up in the air evoke a sense of weightlessness or lightness in the viewers’ minds.",
		author: "Milan Kundera",
		cost: 220,
		price: 340,
		quantity: 15,
		categories: [5, 24],
	},
	{
		name: "The Godfather",
		description:
			"If you know classic book covers, you surely have seen this cover designed by S. Neil Fujita. Fujita’s famous logo design, which portrays a puppeteer orchestrating events, from, behind the curtain resonates with the concluding moments leading up to the last scene. The cover depicts power and control.",
		author: "Mario Puzo",
		cost: 290,
		price: 400,
		quantity: 20,
		categories: [7, 28, 35],
	},
	{
		name: "The Priory of the Orange Tree",
		description:
			"The alluring elements of best fantasy book covers are incorporated into this cover designed by David Mann and illustrated by Ivan Belikov. The cover shows a beautifully designed orange tree imposed by a magnificent dragon displaying the power, magic, and fantasy in the story within. On the cover is a magnificent beast, the dragon Fyredel, who is a relevant part of the plot.",
		author: "Samantha Shannon",
		cost: 320,
		price: 460,
		quantity: 35,
		categories: [1, 18],
	},
	{
		name: "The Wealth of Nations",
		description:
			"The simple, classic off-white aesthetics of this book cover make it signify the historical relevance of this book. The cover represents the Industrial Revolution that took place in 1750 -1760 in England. Illustrations of people doing manual work with gears on the cover symbolize the industrial processes and the industrial capitalist system. It’s a unique representation of Adam Smith’s ideas about markets, economy, and wealth.",
		author: "Adam Smith",
		cost: 280,
		price: 400,
		quantity: 30,
		categories: [2, 12],
	},
	{
		name: "The Master and Margarita",
		description:
			"One of the iconic book covers, this cover artistically displays the devil who, accompanied by a black cat comes to Moscow. The depiction tastefully showcases how the boundaries between the good and the evil are often blurred. The illustrator of this 2016 cover was Christopher Conn Askew.",
		author: "Mikhail Bulgakov",
		cost: 300,
		price: 450,
		quantity: 40,
		categories: [3, 15],
	},
	{
		name: "The Maiden",
		description:
			"Based on a real-life case, The Maiden’s book cover has all the elements of beautiful book covers. Setting the historical thriller theme of the book, the backdrop with vines, plants, flowers and peacocks amidst the deep blue shade tells that the story might be more than what meets the eye.",
		author: "Kate Foster",
		cost: 270,
		price: 400,
		quantity: 35,
		categories: [4, 18],
	},
	{
		name: "Harry Potter and the Sorcerer’s Stone",
		description:
			"One of the most famous book covers of all time, this cover is well-known by people of all ages. The cover reveals an iconic scene from the fictional book, Harry Potter playing Quidditch. Harry floating on the broomstick with Hogwarts in the background gives all the feels of magic, fantasy, mystery, and adventure to the readers.",
		author: "J.K. Rowling",
		cost: 250,
		price: 350,
		quantity: 40,
		categories: [5, 12],
	},
	{
		name: "Intuition: Access your inner wisdom. Trust your instincts. Find your path.",
		description:
			"Tuning your inner self to develop your mental, emotional, and spiritual awareness is the theme comprehensible from the artistic and mindfully designed cover. Illustrated by Eiko Ojala, this book cover is an amalgamation of different shades of blue drawing out a woman’s silhouette. The cover has elements required to be the best book cover design.",
		author: "Amisha Ghadiali",
		cost: 260,
		price: 380,
		quantity: 20,
		categories: [6, 18, 25],
	},
	{
		name: "Jaws",
		description:
			"Designed by artist Paul Bacon, the original hardcover first came out in 1975. This legendary black-hued cover chills our spines. The unaware swimmer in dark water and the monster killer shark approaching silently are what nightmares are made of.",
		author: "Peter Benchley",
		cost: 300,
		price: 420,
		quantity: 25,
		categories: [10, 26],
	},
	{
		name: "The Ghost Ship",
		description:
			"Beautiful illustrations of the ship, dark blue colored background, and drawings of sea waves smoothly paint a picture of the aquatic setting of the story. The dark hues on the cover convey the piracy, mystery, and revenge themes in the book to the readers.",
		author: "Kate Mosse",
		cost: 270,
		price: 400,
		quantity: 30,
		categories: [9, 14, 28],
	},
	{
		name: "The Handmaid’s Tale",
		description:
			"Very prominent in the story and covering half the book cover space, is a very tall wall. It stands out compared to the smaller human figures below. This strongly shows that the wall is impossible to overcome, representing how the handmaids are trapped both physically and mentally. This striking cover was published in 1986.",
		author: "Margaret Atwood",
		cost: 240,
		price: 350,
		quantity: 40,
		categories: [8, 22],
	},
	{
		name: "Instructions for a Funeral",
		description:
			"The coffin-shaped letter cover is more than enough to gain relevance with the title. A creative and genius way to show the short story with the same title in the book. When asked about the title, the author said that the story itself has nothing to do with the title.",
		author: "David Means",
		cost: 250,
		price: 360,
		quantity: 35,
		categories: [5, 24],
	},
	{
		name: "Jurassic Park",
		description:
			"Designer Chip Kidd’s dream assignment, this iconic book cover tells its own story. Creating an atmosphere of thrill, fear, and awe, the book cover features a T-Rex Skeleton which points towards the narrative within the novel. The dark black skeleton and title of the book against the plain white background create a striking contrast.",
		author: "Michael Crichton",
		cost: 280,
		price: 400,
		quantity: 30,
		categories: [2, 12],
	},
	{
		name: "Labyrinths: Selected Stories & Other Writings",
		description:
			"The intricate and mysterious play of shadow and light on this iconic book cover is what makes the book, thought-provoking. The cover design displaying the labyrinthine patterns, is as enigmatic as the book itself.",
		author: "Jorge Luis Borges",
		cost: 260,
		price: 380,
		quantity: 20,
		categories: [6, 18, 25],
	},
	{
		name: "Pineapple Street",
		description:
			"The novel revolves around a family with old money, living in New York City. The fun and captivating, colorful illustrations on the cover take the readers on a ride to the vibrantly decorated household of the family in the story.",
		author: "Jenny Jackson",
		cost: 280,
		price: 400,
		quantity: 30,
		categories: [7, 13],
	},
	{
		name: "I Know Why the Caged Bird Sings",
		description:
			"A free bird flying in the sunrise hues gives a sense of freedom, exploration, and resilience which the novel follows. The different shades of red and yellow add depth to the design. This cover design showcases a symbolic representation.",
		author: "Maya Angelou",
		cost: 260,
		price: 380,
		quantity: 20,
		categories: [10, 26],
	},
	{
		name: "Get in Trouble",
		description:
			"The cover art reflects the magical and extraordinary feel of Link’s short stories. It often shows a surreal image of an upside-down scene that suggests something unusual or otherworldly, pulling readers into the book’s world of unique and engaging stories.",
		author: "Kelly Link",
		cost: 280,
		price: 400,
		quantity: 30,
		categories: [9, 14, 28],
	},
	{
		name: "Goldfinch",
		description:
			"Based on the original 1654 painting, The Goldfinch by Carel Fabritius, this is one of the best book covers of all time. According to the story, the main character steals the painting and hides it in a paper. The cover visual distinctly shows a part of the painting which is visible through a small tear in the wrapped paper.",
		author: "Donna Tartt",
		cost: 300,
		price: 450,
		quantity: 40,
		categories: [1, 18],
	},
	{
		name: "The Performance",
		description:
			"The Performance is a novel that explores the lives of three women who go to a theatre to see a play. The unique play of colors with the faces depicts the different shades of the women’s characters and the theatre reference is visible. It shows an abstract formalism.",
		author: "Claire Thomas",
		cost: 320,
		price: 460,
		quantity: 35,
		categories: [2, 27],
	},
	{
		name: "Children of Blood and Bone",
		description:
			"The book presents a world of magic, power, and danger. Rich Deas designed the cover to reflect the resilience, beauty, and Black heritage of the main young character. The white hair symbolizes Maji, a citizen who can summon magical powers. The cover offers a sneak peek at important issues like racism, oppression, and inner strength.",
		author: "Tomi Adeyemi",
		cost: 280,
		price: 400,
		quantity: 30,
		categories: [3, 15],
	},
	{
		name: "Cat’s Eye",
		description:
			"The creepy book cover by Richard Newton shows a cat’s face on a child’s body who is in the arms of a woman. The eerie cat-baby and its ferocious expression with the big green eyes send chills down our spines. It is quite evident from the cover that horror, supernatural, and thrill are the themes of this story.",
		author: "William W. Johnstone",
		cost: 300,
		price: 420,
		quantity: 25,
		categories: [10, 26],
	},
	{
		name: "Ghost Forest",
		description:
			"The soft colors and symbols used on the cover show the cultural influences in the book. The undrawn face also illuminates a sense of an incomplete identity. It’s a gentle but strong picture that brings you into the artist’s feelings, giving you a hint of the moving stories you’ll find inside the graphic novel.",
		author: "Pik-Shuen Fung",
		cost: 270,
		price: 400,
		quantity: 30,
		categories: [9, 14, 28],
	},
	{
		name: "Winning Minds: Secrets From the Language of Leadership",
		description:
			"The brain is the most complicated organ of the human body. These intricate details of the brain are represented by a tangled ball of yarn. A hand pulling the string from this yarn is trying to unwind a mess and show the influence of neuroscience.",
		author: "Simon Lancaster",
		cost: 290,
		price: 400,
		quantity: 20,
		categories: [7, 13],
	},
	{
		name: "Despair",
		description:
			"This strange book cover serves as a visual gateway into the unsettling, dark, and mysterious themes of the book. The uncanny image of a human body with a disfigured face attracts the reader’s attention quite quickly. The cover was designed by John Holmes who was known for his captivating style.",
		author: "Vladimir Nabokov",
		cost: 280,
		price: 400,
		quantity: 30,
		categories: [6, 18, 25],
	},
	{
		name: "Little Rivers: A Book of Essays in Profitable Idleness",
		description:
			"This cover falls into the pretty book covers category. The dark blue background and the beautiful natural elements like fireflies, vines, and flowers in golden and green embellishments are a reflection of the book’s essence.",
		author: "Henry Van",
		cost: 260,
		price: 380,
		quantity: 20,
		categories: [5, 24],
	},
	{
		name: "More Than This",
		description:
			"The yellow door amidst the cross pattern in the background symbolizes the death of the main character. Surprisingly, yellow symbolizes death and the novel makes us think about what being alive means. This strikingly variable book cover piques the interest of the viewers.",
		author: "Patrick Ness",
		cost: 280,
		price: 400,
		quantity: 30,
		categories: [9, 14, 28],
	},
	{
		name: "Tomorrow, and Tomorrow, and Tomorrow",
		description:
			"This book, written by the popular author Gabrielle Zevin, comes with a captivating book cover. The book’s title stands out on the cover in bright yellow, pink, and blue, giving a lively and optimistic feel. The vibrant background with a dynamic wave illustration perfectly represents the video game design base of the story. Also, the similarity in the font colors represents second chances.",
		author: "Gabrielle Zevin",
		cost: 300,
		price: 450,
		quantity: 40,
		categories: [1, 18],
	},
	{
		name: "A Small Fortune",
		description:
			"Designed by Nicole LaRoche in 2012, this book has a minimalistic book cover design. A beautiful, fresh shade of blue as the background, and a kettle pouring colorful drops of what can be deciphered as tea show the different shades of the human life depicted in the story.",
		author: "Rosie Dastgir",
		cost: 320,
		price: 460,
		quantity: 35,
		categories: [2, 27],
	},
	{
		name: "1984",
		description:
			"The mystical eye illustration in dark shadows and the use of black and red colors make it a bold display. The eye symbolizes the idea that “Big Brother is watching,” indicating how the government keeps an eye on citizens, watching their actions and words to avoid any political rebellion. Designed by Shepard Fairey, this book cover captures the essence of George Orwell’s dystopian classic.",
		author: "George Orwell",
		cost: 240,
		price: 350,
		quantity: 40,
		categories: [8, 22],
	},
	{
		name: "Flowers in the Attic",
		description:
			"A house with a captivating girl, Cathy peering from an attic window, a striking image makes this one of the best covers of the book world. The scared expression on her gives us the sense of being trapped. This unsettling cover perfectly echoes the haunting and dark themes of the story and attracts readers.",
		author: "V.C. Andrews",
		cost: 260,
		price: 380,
		quantity: 20,
		categories: [10, 26],
	},
];

module.exports = app;
