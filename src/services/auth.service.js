const jwtwebToken = require('jsonwebtoken');

module.exports = class authService {
    constructor (authRepository) {
        this.authRepository = authRepository;
    }
    tokenVerify = async (refreshToken) => {
        try{
        const token = jwtwebToken.verify(refreshToken, 'resume&%*');
        if (!token.userId) throw new Error('토큰값이 올바르지 않습니다.');
        const user = await this.authRepository.tokenSearch(token);
        const newAccessToken = jwtwebToken.sign({ userId: user.userId}, 'resume@#', { expiresIn: '12h' });
        const newRefreshToken = jwtwebToken.sign({ userId: user.userId }, 'resume&%*', { expiresIn: '7d' });
        return [newAccessToken, newRefreshToken]
        }catch(err){

        }
    }




}