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
            status: true,
            user: {
                select: {
                    name: true,
                }
            },
            createdAt: true,
        },
        orderBy: [
            {
                [orderKey]: orderValue.toLowerCase(),
            }
        ]
    })

    return res.json({ data: resumes });
})

router.get('/:resumeId', async (req, res) => {
    const resumeId = req.params.resumeId;
    if (!resumeId) {
        return res.status(400).json({
            success: false,
            message: 'resumeId는 필수값입니다.'
        })
    }

    const resume = await prisma.resume.findFirst({
        where: {
            resumeId: Number(resumeId),
        },
        select: {
            resumeId: true,
            title: true,
            content: true,
            status: true,
            user: {
                select: {
                    name: true,
                }
            },
            createdAt: true,
        },
    })

    if (!resume) {
        return res.json({ data: {} });
    }

    return res.json({ data: resume });
})

router.post('/', jwtValidate, async (req, res) => {
    const user = res.locals.user;
    const { title, content } = req.body;
    if (!title) {
        return res.status(400).json({
            success: false,
            message: '이력서 제목은 필수값 입니다'
        })
    }

    if (!content) {
        return res.status(400).json({
            success: false,
            message: '자기소개는 필수값 입니다'
        })
    }

    await prisma.resume.create({
        data: {
            title,
            content,
            status: 'APPLY',
            userId: user.userId,
        }
    })

    return res.status(201).end();
})

router.patch('/:resumeId', jwtValidate, async (req, res) => {
    const user = res.locals.user;
    const resumeId = req.params.resumeId;
    const { title, content, status } = req.body;

    if (!resumeId) {
        return res.status(400).json({
            success: false,
            message: 'resumeId 는 필수값입니다',
        })
    }

    if (!title) {
        return res.status(400).json({
            success: false,
            message: '이력서 제목은 필수값입니다',
        })
    }

    if (!content) {
        return res.status(400).json({
            success: false,
            message: '자기소개는 필수값입니다',
        })
    }

    if (!status) {
        return res.status(400).json({
            success: false,
            message: '상태값은 필수값입니다',
        })
    }

    // status 는 존재
    if (!['APPLY', 'DROP', 'PASS', 'INTERVIEW1', 'INTERVIEW2', 'FINAL_PASS'].includes(status)) {
        return res.status(400).json({
            success: false,
            message: '올바르지 않은 상태값 입니다.',
        })
    }

    const resume = await prisma.resume.findFirst({
        where: {
            resumeId: Number(resumeId),
        }
    });

    if (!resume) {
        return res.status(400).json({
            success: false,
            message: '존재하지 않는 이력서 입니다.',
        })
    }

    if (user.grade === 'user' && resume.userId !== user.userId) {
        return res.status(400).json({
            success: false,
            message: '올바르지 않은 요청입니다.',
        })
    }

    // 내가 작성한 이력서이거나 권한 등급이 admin이다.
    await prisma.resume.update({
        where: {
            resumeId: Number(resumeId),
        },
        data: {
            title,
            content,
            status
        }
    })

    return res.status(201).end()
})

router.delete('/:resumeId', jwtValidate, async (req, res) => {
    const user = res.locals.user;
    const resumeId = req.params.resumeId;

    if (!resumeId) {
        return res.status(400).json({
            success: false,
            message: 'resumeId 는 필수값입니다',
        })
    }

    const resume = await prisma.resume.findFirst({
        where: {
            resumeId: Number(resumeId),
        }
    });

    if (!resume) {
        return res.status(400).json({
            success: false,
            message: '존재하지 않는 이력서 입니다.',
        })
    }

    if (resume.userId !== user.userId) {
        return res.status(400).json({
            success: false,
            message: '올바르지 않은 요청입니다.',
        })
    }

    await prisma.resume.delete({
        where: {
            resumeId: Number(resumeId),
        },
    })

    return res.status(201).end();
})

module.exports = router;