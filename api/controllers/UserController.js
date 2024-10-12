const express = require('express');
const app = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

function checkSignIn(req, res, next) {
    try {
        const token = req.headers['authorization'];
        if (!token) return res.status(401).send({ error: 'Unauthorized: No token provided', redirect: true });

        const secret = process.env.TOKEN_SECRET;
        const decoded = jwt.verify(token, secret);

        req.user = decoded;
        next();
    } catch (e) {
        return res.status(401).send({ error: 'Unauthorized: Invalid or expired token', redirect: true });
    }
}

// app.use(checkSignIn); //Protected every routh

// No need to use anymore
// function getUserId(req, res) {
//     try {
//         const secret = process.env.TOKEN_SECRET;
//         const token = req.headers['authorization'];
//         const result = jwt.verify(token, secret);

//         if (result != undefined) {
//             return result.id;
//         }
//     } catch (e) {
//         res.status(500).send({ error: e.message });
//     }
// }

app.post('/signIn', async (req, res) => {
    try {
        if (!req.body.user) {
            return res.status(411).send({ message: 'Username is required!' });
        }
        if (!req.body.pass) {
            return res.status(412).send({ message: 'Password is required!' });
        }

        const user = await prisma.user.findFirst({
            select: {
                id: true,
                name: true
            },
            where: {
                user: req.body.user,
                pass: req.body.pass,
                status: 'use'
            }
        });

        if (user !== null) {
            const secret = process.env.TOKEN_SECRET;
            const token = jwt.sign(user, secret, { expiresIn: '30d' });
            return res.status(200).send({ token: token });
        }

        res.status(410).send({ message: 'Invalid! Username or Password' });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

app.get('/info', checkSignIn, async (req, res) => {
    try {
        //const userId = getUserId(req, res);
        const user = await prisma.user.findFirst({
            select: {
                name: true
            },
            where: {
                id: req.user.id
            }
        })

        res.send({ result: user });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
})


module.exports = app;