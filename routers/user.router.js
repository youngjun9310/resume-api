const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const sha256 = require('crypto-js/sha256');
const jwtwebToken = require('jsonwebtoken');
const jwtValidate = require('../middleware/jwt-validate.middleware');

const router = express.Router();

/**
 * @swagger
 * /users/sign-up:
 *   post:
 *     summary: 회원가입 API
 *     description: 카카오 로그인이나 이메일/패스워드를 통해 회원가입을 시도하는 API
 *     parameters:
 *       - in: body
 *         type: object
 *         description: 회원가입 요청 body data
 *         schema:
 *           properties:
 *             email:
 *               type: string
 *               descriptoin: 이메일
 *               example: 'a@com'
 *               required: false
 *             clientId:
 *               type: string
 *               descriptoin: 카카오 로그인했을 경우 카카오 클라이언트 아이디
 *               example: 'kdjalkfjaewpwoepq91129123'
 *               required: false
 *             password:
 *               type: string
 *               descriptoin: 이메일 로그인일 경우 비밀번호
 *               example: '123123'
 *               required: false
 *             passwordConfirm:
 *               type: string
 *               descriptoin: 이메일 로그인일 경우 비밀번호 확인
 *               example: '123123'
 *               required: false
 *             name:
 *               type: string
 *               descriptoin: 이름
 *               example: '홍길동'
 *               required: true
 *             grade:
 *               type: string
 *               descriptoin: 회원 등급 (기본값 user, 인사담당자 admin)
 *               example: 'user'
 *               required: false
 * 
 *     responses:
 *       '201':
 *         description: 정상적인 회원가입 완료
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email: 
 *                   type: string
 *                   description: 가입 이메일
 *                   required: false
 *                 name:
 *                   type: string
 *                   description: 가입 이름
 *                   required: true
 *  
 *       '400':
 *         description: 정상적인 회원가입 완료
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: 
 *                   type: boolean
 *                   description: 성공 완료 여부
 *                   required: true
 *                 message:
 *                   type: string
 *                   description: 오류 메시지
 *                   required: true
 */
router.post('/sign-up', async (req, res) => {
    const { email, clientId, password, passwordConfirm, name, grade } = req.body;
    if (grade && !['user', 'admin'].includes(grade)) {
        return res.status(400).json({ success: false, message: '등급이 올바르지 않습니다.' })
    }

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
                grade,
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
                grade,
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
    const refreshToken = jwtwebToken.sign({ userId: user.userId }, 'resume&%*', { expiresIn: '7d' });
    return res.json({
        accessToken,
        refreshToken,
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