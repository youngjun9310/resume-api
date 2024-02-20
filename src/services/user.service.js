const sha256 = require('crypto-js/sha256');
const jwtwebToken = require('jsonwebtoken');
module.exports = class userService {
    constructor (userRepositories){
        this.userRepositories = userRepositories;
    }

    kakaoSignUp = async (clientId, name, grade) => {
        try{
        const kakaoSignIn = await this.userRepositories.kakaoSignIn(clientId);
        if (kakaoSignIn) {
        return res.status(400).json({ success: false, message: '이미 가입된 사용자 입니다.' })
        }
        const kakaoSignUp = await this.userRepositories.kakaoSignUp(clientId, name, grade);
        return {name : kakaoSignUp.name}
        }catch(err){

        }
    }

    signUp = async (email, password, name, grade) => {
        try{
        const signIn = await this.userRepositories.signIn(email);
        if (signIn) {
            return res.status(400).json({ success: false, message: '이미 가입된 사용자 입니다.' })
        }
        password = sha256(password).toString()
        const signUp = await this.userRepositories.signUp(email, password, name, grade);
        return signUp;
        }catch(err){
        
        }
    }

    kakaoSignIn = async (clientId) => {
        try{
        const kakaoSignIn = await this.userRepositories.kakaoSignIn(clientId);
        if (!kakaoSignIn){
            return res.status(401).json({ success: false, message: '올바르지 않은 로그인 정보입니다.' })
        }
        const accessToken = jwtwebToken.sign({ userId: kakaoSignIn.userId }, 'resume@#', { expiresIn: '12h' });
        const refreshToken = jwtwebToken.sign({ userId: kakaoSignIn.userId }, 'resume&%*', { expiresIn: '7d' });
        return [accessToken, refreshToken]
        }catch(err){
        
        }
    }

    signIn = async (email, password) => {
        try{
        password = sha256(password).toString()
        const signIn = await this.userRepositories.signIn(email, password);
        if (!signIn) {
            return res.status(401).json({ success: false, message: '올바르지 않은 로그인 정보입니다.' })
        }
        const accessToken = jwtwebToken.sign({ userId: signIn.userId }, 'resume@#', { expiresIn: '12h' });
        const refreshToken = jwtwebToken.sign({ userId: signIn.userId }, 'resume&%*', { expiresIn: '7d' });
        return [accessToken, refreshToken]
        }catch(err){
        
        }
    }
}