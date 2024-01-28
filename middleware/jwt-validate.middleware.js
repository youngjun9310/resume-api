const jwtwebToken = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const jwtValidate = async (req, res, next) => {
    try {
        // 헤더에서 accessToken 가져오기
        const authorization = req.headers.authorization;
        if (!authorization) {
            throw new Error('인증 정보가 올바르지 않습니다.');
        }

        // accessToken 의 인증방식이 올바른가
        // Bearer {jwt}
        const [tokenType, tokenValue] = authorization.split(' ');
        if (tokenType !== 'Bearer') {
            throw new Error('인증 정보가 올바르지 않습니다.');
        }

        if (!tokenValue) {
            throw new Error('인증 정보가 올바르지 않습니다.');
        }

        // 12h 의 유효기간이 남아있는가?
        const token = jwtwebToken.verify(tokenValue, 'resume@#');

        // accessToken 안에 userId 데이터가 잘 들어있는가?
        if (!token.userId) {
            throw new Error('인증 정보가 올바르지 않습니다.');
        }

        const user = await prisma.user.findFirst({
            where: {
                userId: token.userId,
            }
        })

        if (!user) {
            throw new Error('인증 정보가 올바르지 않습니다.');
        }

        // user 정보 담기
        res.locals.user = user;

        next();
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message,
        })
    }
}

module.exports = jwtValidate