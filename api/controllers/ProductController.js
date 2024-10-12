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

app.post('/create', checkSignIn, async (req, res) => {
    try {
        const errorList = [];
        if (!req.body.name) errorList.push('name');
        if (!req.body.cost || req.body.cost < 0) errorList.push('cost');
        if (!req.body.price || req.body.price < 0) errorList.push('price');
        if (errorList.length !== 0) return res.status(410).send({ data: errorList });

        await prisma.product.create({
            data: req.body
        });

        res.send({ message: 'success' });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
})

app.get('/list', checkSignIn, async (req, res) => {
    try {
        const data = await prisma.product.findMany({
            orderBy: {
                id: 'desc'
            }
        })

        res.send({ results: data });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
})


module.exports = app;