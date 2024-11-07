const express = require('express');
const app = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const fileUpload = require('express-fileupload');
const exceljs = require('exceljs');
const ifIsImage = require('if-is-image');

dotenv.config();

app.use(fileUpload());

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
        if (errorList.length !== 0) return res.status(410).send({ errorList: errorList });

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
            },
            where: {
                status: 'use'
            }
        })

        res.send({ results: data });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
})

app.put('/update', checkSignIn, async (req, res) => {
    try {
        const errorList = [];
        if (!req.body.name) errorList.push('name');
        if (!req.body.cost || req.body.cost < 0) errorList.push('cost');
        if (!req.body.price || req.body.price < 0) errorList.push('price');
        if (errorList.length !== 0) return res.status(410).send({ errorList: errorList });

        //delete old product image
        const fs = require('fs');
        const oldData = await prisma.product.findFirst({
            where: {
                id: parseInt(req.body.id)
            }
        });
        if (oldData.img !== "noIMGFile") {
            if (fs.existsSync('./uploads/product_img/' + oldData.img)) {
                await fs.unlinkSync('./uploads/product_img/' + oldData.img); //Delete old file
            }
        }

        await prisma.product.update({
            data: req.body,
            where: {
                id: parseInt(req.body.id)
            }
        });

        res.send({ message: 'success' });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
})

app.delete('/remove/:id', checkSignIn, async (req, res) => {
    try {
        await prisma.product.update({
            data: {
                status: 'delete'
            },
            where: {
                id: parseInt(req.params.id)
            }
        })

        res.send({ message: 'success' });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
})

app.post('/upload', checkSignIn, async (req, res) => {
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

            const arrFileName = img.name.split('.');
            const ext = arrFileName[arrFileName.length - 1];

            const newName = `${y}${m}${d}${h}${mi}${s}${ms}.${ext}`;

            img.mv('./uploads/product_img/' + newName, (err) => {
                if (err) throw err;
                res.send({ newName: newName });
            })
        } else {
            res.send({ newName: "noIMGFile" });
        }
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
})

app.post('/uploadFromExcel', checkSignIn, (req, res) => {
    try {
        const fileExcel = req.files.fileExcel;

        fileExcel.mv('./uploads/products_sheet/' + fileExcel.name, async (err) => {
            if (err) throw err;

            const workbook = new exceljs.Workbook();
            await workbook.xlsx.readFile('./uploads/products_sheet/' + fileExcel.name);

            const ws = workbook.getWorksheet(1);

            for (let i = 2; i <= ws.rowCount; i++) {
                const name = ws.getRow(i).getCell(1).value ?? ""; //if null or undefined return ""
                const cost = ws.getRow(i).getCell(2).value ?? 0; //if null or undefined return 0
                const price = ws.getRow(i).getCell(3).value ?? 0;

                if (name != "" && cost >= 0 && price >= 0) {
                    await prisma.product.create({
                        data: {
                            name: name,
                            cost: cost,
                            price: price,
                            img: "noIMGFile"
                        }
                    })
                }
            }
            //remove sheet file after read
            const fs = require('fs');
            await fs.unlinkSync('./uploads/products_sheet/' + fileExcel.name);

            res.send({ message: 'success' });
        })
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
})

module.exports = app;