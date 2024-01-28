const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const sha256 = require('crypto-js/sha256');
const jwtwebToken = require('jsonwebtoken');
const jwtValidate = require('../middleware/jwt-validate.middleware');

const router = express.Router();

router.post('/sign-up', async (req, res) => {
    const { email, clientId, password, passwordConfirm, name } = req.body;
    if (!clientId) {
        if (!email) {
            return res.status(400).json({ success: false, message: '이메일은 필수값입니다.' })
        }

        if (!password) {
            return res.status(400).json({ success: false, message: '비밀번호는 필수값입니다.' })
        }

        if (!passwordConfirm) {
            return res.status(400).json({ success: false, message: '비밀번호 확인은 필수값입니다.' })
        }

        if (password.length < 6) {
            return res.status(400).json({ success: false, message: '비밀번호는 최소 6자 이상입니다.' })
        }

        if (password !== passwordConfirm) {
            return res.status(400).json({ success: false, message: '비밀번호와 비밀번호 확인값이 일치하지 않습니다.' })
        }
    }

    if (!name) {
        return res.status(400).json({ success: false, message: '이름은 필수값입니다.' })
    }

    // clientId (kakao)
    if (clientId) {
        const user = await prisma.user.findFirst({
            where: {
                clientId,
            }
        })

        if (user) {
            return res.status(400).json({ success: false, message: '이미 가입된 사용자 입니다.' })
        }

        await prisma.user.create({
            data: {
                clientId,
                name,
            }
        });
    } else {
        // email
        const user = await prisma.user.findFirst({
            where: {
                email,
            }
        })

        if (user) {
            return res.status(400).json({ success: false, message: '이미 가입된 이메일 입니다.' })
        }

        await prisma.user.create({
            data: {
                email,
                password: sha256(password).toString(),
                name,
            }
        });
    }

    return res.status(201).json({
        email,
        name,
    })
})

router.post('/sign-in', async (req, res) => {
    const { clientId, email, password } = req.body;
    let user;
    if (clientId) {
        // 카카오 로그인
        user = await prisma.user.findFirst({
            where: {
                clientId,
            }
        })

        if (!user) {
            return res.status(401).json({ success: false, message: '올바르지 않은 로그인 정보입니다.' })
        }
    } else {
        // email 로그인
        if (!email) {
            return res.status(400).json({ success: false, message: '이메일은 필수값입니다.' })
        }

        if (!password) {
            return res.status(400).json({ success: false, message: '비밀번호는 필수값입니다.' })
        }

        user = await prisma.user.findFirst({
            where: {
                email,
                password: sha256(password).toString(),
            }
        })

        if (!user) {
            return res.status(401).json({ success: false, message: '올바르지 않은 로그인 정보입니다.' })
        }
    }


    // 로그인 성공
    const accessToken = jwtwebToken.sign({ userId: user.userId }, 'resume@#', { expiresIn: '12h' })
    return res.json({
        accessToken,
    })
})

router.get('/me', jwtValidate, (req, res) => {
    const user = res.locals.user;

    return res.json({
        email: user.email,
        name: user.name,
    })
})

module.exports = router;