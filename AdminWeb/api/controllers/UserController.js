const express = require("express");
const app = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const { checkSignIn } = require("../middleware/auth");

app.post("/signIn", async (req, res) => {
    try {
        if (!req.body.username && !req.body.user) {
            return res.status(411).send({ message: "Username is required!" });
        }
        if (!req.body.password && !req.body.pass) {
            return res.status(412).send({ message: "Password is required!" });
        }

        const username = req.body.username || req.body.user;
        const password = req.body.password || req.body.pass;
        
        // Determine if this is an admin login attempt
        const isAdminLogin = !!req.body.user && !!req.body.pass;

        const user = await prisma.user.findFirst({
            select: {
                id: true,
                name: true,
                role: true,
                status: true,
                profile: true
            },
            where: {
                username: username,
                password: password,
                status: "use",
                role: isAdminLogin ? "admin" : "client"
            },
        });

        if (!user) {
            return res.status(410).send({ message: "Invalid! Username or Password" });
        }

        if (user.status !== "use") {
            return res.status(403).send({ message: "Account is disabled" });
        }

        const tokenPayload = {
            id: user.id,
            name: user.name,
            role: user.role
        };

        const token = jwt.sign(tokenPayload, process.env.TOKEN_SECRET, { expiresIn: "30d" });

        // Return role-specific response
        if (user.role === "admin") {
            return res.status(200).send({ token });
        } else {
            return res.status(200).send({
                token,
                role: user.role,
                user: {
                    id: user.id,
                    name: user.name,
                    role: user.role,
                    profile: user.profile
                }
            });
        }

    } catch (e) {
        console.error("SignIn error:", e);
        res.status(500).send({ error: e.message });
    }
});

app.get("/info", checkSignIn, async (req, res) => {
    try {
        console.log("Fetching user info for id:", req.user.id);
        
        const user = await prisma.user.findUnique({
            where: {
                id: req.user.id,
                status: "use"
            },
            select: {
                id: true,
                name: true,
                profile: true,
                role: true,
                address: true,
                phone: true,
                cartQty: true,
                cartTotal: true
            }
        });

        if (!user) {
            console.log("User not found or inactive");
            return res.status(404).send({ error: "User not found or inactive" });
        }

        console.log("User info found:", { id: user.id, role: user.role });
        res.send({ result: user });
        
    } catch (e) {
        console.error("Info fetch error:", e);
        res.status(500).send({ error: e.message });
    }
});

// Registration endpoint for clients
app.post("/register", async (req, res) => {
    console.log('Received registration request with body:', {
        ...req.body,
        password: req.body.password ? '[REDACTED]' : undefined
    });

    try {
        // Validate required fields
        const requiredFields = ['name', 'username', 'password', 'address', 'phone'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            console.log('Registration failed: Missing required fields:', missingFields);
            return res.status(411).send({ 
                message: "Missing required fields", 
                fields: missingFields 
            });
        }

        // Block duplicate user creation
        console.log('Checking for existing username:', req.body.username);
        const existingUser = await prisma.user.findUnique({
            where: {
                username: req.body.username
            }
        });

        if (existingUser) {
            console.log('Registration failed: Username already exists');
            return res.status(409).send({ 
                message: "Username already exists" 
            });
        }

        console.log('Creating new user...');
        // Create new user
        const newUser = await prisma.user.create({
            data: {
                name: req.body.name,
                username: req.body.username,
                password: req.body.password,
                address: req.body.address,
                phone: req.body.phone,
                role: "client",
                status: "use",
                cartQty: 0,
                cartTotal: 0
            },
            select: {
                id: true,
                name: true,
                role: true
            }
        });

        console.log('User created successfully, generating token...');
        // Generate token for automatic sign in after registration
        const secret = process.env.TOKEN_SECRET;
        const token = jwt.sign(newUser, secret, { expiresIn: "30d" });

        console.log('Registration complete, sending response');
        res.status(201).send({
            message: "Registration successful",
            token: token,
            role: newUser.role
        });

    } catch (e) {
        console.error('Detailed registration error:', {
            message: e.message,
            stack: e.stack,
            type: e.constructor.name,
            code: e.code
        });
        res.status(500).send({ error: e.message });
    }
});


app.get("/clientList", checkSignIn, async (req, res) => {
	try {
		const users = await prisma.user.findMany({
			orderBy: {
				id: "desc",
			},
			where: {
				role: "client",
				status: "use",
			},
		});

		res.send({ results: users });
	} catch (e) {
		res.status(500).send({ error: e.message });
	}
});

app.put("/clientUpdate", checkSignIn, async (req, res) => {
	try {
		//Validate
		const errorList = [];
		if (!req.body.name) errorList.push("name");
		console.log("errorList: ", errorList);
		if (errorList.length > 0)
			return res.status(410).send({ errorList: errorList });

		const user = await prisma.user.update({
			data: req.body,
			where: {
				id: req.body.id,
			},
		});

		res.send({ message: "success", result: user });
	} catch (e) {
		console.log("Error: Client update", e);
		res.status(500).send({ error: e.message });
	}
});

app.put("/clientRemove", checkSignIn, async (req, res) => {
	try {
		console.log("Remove client ID: ", req.body.id);
		//Validate
		await prisma.user.updateMany({
			data: {
				status: "delete",
			},
			where: {
				id: {
					in: req.body.id,
				},
				status: "use",
				role: "client",
			},
		});

		res.send({ message: "success" });
	} catch (e) {
		res.status(500).send({ error: e.message });
	}
});

module.exports = app;
