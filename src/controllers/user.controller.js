module.exports = class userController {
    constructor (userService){
        this.userService = userService;
    }
    signUp = async (req, res, next) => {
        try{
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
            const kakaoSignUp = await this.userService.kakaoSignUp(
                clientId,
                name,
                grade,
            )
            return res.status(201).json({
                data : kakaoSignUp
            });
        }else{
            const signUp = await this.userService.signUp(
                email,
                password,
                name,
                grade
            );

            return res.status(201).json({
                data : { email : signUp.email, name : signUp.name }
            });
        }
        }catch(err){

        }
    }
    signIn = async (req, res, next) => {
        try{
        const { clientId, email, password } = req.body;
        // 카카오 로그인
        if (clientId) {
            const [accessToken, refreshToken] = await this.userService.kakaoSignIn(clientId)
            return res.json({
                accessToken,
                refreshToken,
            })
        } else {
        // email 로그인
            if (!email) {
                return res.status(400).json({ success: false, message: '이메일은 필수값입니다.' })
            }
    
            if (!password) {
                return res.status(400).json({ success: false, message: '비밀번호는 필수값입니다.' })
            }
    
            const [accessToken, refreshToken] = await this.userService.signIn(email, password)
            return res.json({
                accessToken,
                refreshToken,
            })
        }
        }catch(err){

        }
    }
    me = async (req, res, next) => {
        try{
        const user = res.locals.user;
        const { refreshToken } = req.body;
        if (!refreshToken){
            return res.status(401).end();
        }
        return res.json({
            email: user.email,
            name: user.name,
        })
        }catch(err){

        }
    }
}

// router.post('/sign-up', userController.signUp);
// router.post('/sign-in', userController.signIn);
// router.get('/me', jwtValidate, userController.me);