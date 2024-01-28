const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwtwebToken = require('jsonwebtoken');
const jwtValidate = require('../middleware/jwt-validate.middleware');
const router = express.Router();

router.get('/', async (req, res) => {
    const orderKey = req.query.orderKey ?? 'resumeId';
    const orderValue = req.query.orderValue ?? 'desc';

    if (!['resumeId', 'status'].includes(orderKey)) {
        return res.status(400).json({
            success: false,
            message: 'orderKey 가 올바르지 않습니다.'
        })
    }

    if (!['asc', 'desc'].includes(orderValue.toLowerCase())) {
        return res.status(400).json({
            success: false,
            message: 'orderValue 가 올바르지 않습니다.'
        })
    }

    const resumes = await prisma.resume.findMany({
        select: {
            resumeId: true,
            title: true,
            content: true,
            user: {
                select: {
                    name: true,
                }
            },
            createdAt: true,
        },
        orderBy: [
            {
                [orderKey]: orderValue,
            }
        ]
    })

    return res.json({ data: resumes });
})

module.exports = router;