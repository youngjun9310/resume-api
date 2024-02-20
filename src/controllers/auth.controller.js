module.exports = class authController {
    constructor (authService){
        this.authService = authService;
    }
    tokenPost = async (req, res, next) => {
        try{
        const { refreshToken } = req.body;
        if (!refreshToken){
            return res.status(401).end();
        }
        const [newAccessToken, newRefreshToken] = await this.authService.tokenVerify(refreshToken);

        return res.json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        })
        }catch(err){

        }
    }
}