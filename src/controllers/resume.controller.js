module.exports = class resumeController {
    constructor (resumeService){
        this.resumeService = resumeService;
    }
    getResumes = async (req, res, next) => {
        try{
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
            const resumes = await this.resumeService.getResumes(orderKey, orderValue);
            return res.status(200).json({ data: resumes });
        }catch(err){

        }
    }
    getResumeById = async (req, res, next) => {
        try{
            const resumeId = req.params.resumeId;
            if (!resumeId) {
                return res.status(400).json({
                    success: false,
                    message: 'resumeId는 필수값입니다.'
                })
            }
            const resume = this.resumeService.getResumeById(resumeId);
            return res.status(200).json({ data: resume });
        }catch(err){

        }
    }
    createResume = async (req, res, next) => {
        try{
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

        const createdResume = await this.resumeService.createResume(user, title, content);
        return res.status(201).json({ data : createdResume });
        }catch(err){

        }
    }
    updateResume = async (req, res, next) => {
        try{
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
            const resume = await this.resumeService.updateResume(user, resumeId, title, content, status);
            return res.status(201).json({data : resume });
        }catch(err){

        }
    }
    deleteResume = async (req, res, next) => {
        try{
            const user = res.locals.user;
            const resumeId = req.params.resumeId;
            if (!resumeId) {
                return res.status(400).json({
                    success: false,
                    message: 'resumeId 는 필수값입니다',
                })
            }
            const resume = await this.resumeService.deleteResume(user, resumeId);
        return res.status(201).json({ data : resume })
        }catch(err){

        }
    }
}
// router.get('/', resumeController.getResumes);
// router.get('/:resumeId', resumeController.getResumeById);
// router.post('/', jwtValidate, resumeController.createResume);
// router.patch('/:resumeId', jwtValidate, resumeController.updateResume);
// router.delete('/:resumeId', jwtValidate, resumeController.deleteResume);