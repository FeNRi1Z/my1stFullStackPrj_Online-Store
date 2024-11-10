const express = require('express');
const app = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const dotenv = require('dotenv');
const fileUpload = require('express-fileupload');
const exceljs = require('exceljs');
const ifIsImage = require('if-is-image');

dotenv.config();

const { checkSignIn } = require('../middleware/auth');

app.use(fileUpload());

app.post('/create', checkSignIn, async (req, res) => {
    try {
        const errorList = [];
        if (!req.body.name) errorList.push('name');
        if (!req.body.cost || req.body.cost < 0) errorList.push('cost');
        if (!req.body.price || req.body.price < 0) errorList.push('price');

        if (errorList.length > 0) return res.status(410).send({ errorList: errorList });
        console.log(req.body);
        await prisma.product.create({
            data: {
                name: req.body.name,
                cost: req.body.cost,
                price: req.body.price,
                img: req.body.img,
                authorId: req.body.authorId ? req.body.authorId : 1,
                desc: req.body.desc,
                quantity: req.body.quantity
            }
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
            },
            include: {
                author: true
            }
        })

        const results = data.map(product => ({
            ...product,
            author: product.author.name,
        }));

        res.send({ results: results });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
})

app.get('/authors', checkSignIn, async (req, res) => {
    try {
        const data = await prisma.author.findMany({
            orderBy: {
                id: 'asc'
            }
        })

        res.send({ results: data });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
})

app.post('/createAuthor', checkSignIn, async (req, res) => {
    try {
        const errorList = [];
        if (!req.body.author) errorList.push('author');
        if (errorList.length !== 0) return res.status(410).send({ errorList: errorList });

        const result = await prisma.author.create({
            data: { name: req.body.author }
        });

        res.send({
            message: 'success',
            authorId: result.id
        });
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
            data: {
                name: req.body.name,
                cost: req.body.cost,
                price: req.body.price,
                img: req.body.img,
                authorId: req.body.authorId,
                desc: req.body.desc,
                quantity: req.body.quantity
            },
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