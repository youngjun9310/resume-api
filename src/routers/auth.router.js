const express = require('express');
const jwtwebToken = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

router.post('/token', async (req, res) => {
    const { refreshToken } = req.body;

    const token = jwtwebToken.verify(refreshToken, 'resume&%*');
    if (!token.userId) {
        return res.status(401).end();
    }

    const user = await prisma.user.findFirst({
        where: {
            userId: token.userId,
        }
    })

    if (!user) {
        return res.status(401).end();
    }

    // freshToken 유효함 -> accessToken, refreshToken 재발급
    const newAccessToken = jwtwebToken.sign({ userId: user.userId }, 'resume@#', { expiresIn: '12h' });
    const newRefreshToken = jwtwebToken.sign({ userId: user.userId }, 'resume&%*', { expiresIn: '7d' });

    return res.json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
    })
})

module.exports = router;

