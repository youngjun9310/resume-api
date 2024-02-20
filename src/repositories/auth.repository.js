module.exports = class authRepository {
    constructor (prisma) {
        this.prisma = prisma;
    }
    tokenVerify = async (token) => {
        try{
        const user = await this.prisma.user.findFirst({
            where: {
                userId: token.userId,
            }
        })
        if (!user) throw new Error('유저 정보를 찾을 수 없습니다.');

        return user;

        }catch(err){

        }
    }
}