module.exports = class userRepositories {
    constructor (prisma){
        this.prisma = prisma;
    }

    kakaoSignUp = async (clientId, name, grade) => {
        try{
        const kakaoSignUp = await this.prisma.user.create({
            data: {
                clientId, 
                name, 
                grade,
            }
        });
        return kakaoSignUp;
        }catch(err){

        }
    }

    signUp = async (email, password, name, grade) => {
        try{
        const signUp = await this.prisma.user.create({
            data: {
                email, 
                password, 
                name, 
                grade,
            }
        });
        return signUp;
        }catch(err){

        }
    }

    kakaoSignIn = async (clientId) => {
        try{
        const kakaoSignIn = await this.prisma.user.findFirst({where: {clientId,}})
        return kakaoSignIn;
        }catch(err){

        }
    }

    signIn = async (email) => {
        try{
        const signIn = await this.prisma.user.findFirst({where: {email, password,}})
        return signIn;
        }catch(err){

        }
    }
}