module.exports = class resumeService {
    constructor (resumeRepositories){
        this.resumeRepositories = resumeRepositories;
    }

    getResumes = async (orderKey, orderValue) => {
        try{
            let resumes = await this.resumeRepositories.getResumes();
            if (orderValue === 'desc'){
                resumes = resumes.sort((a, b) => {
                return b.orderKey - a.orderKey;
                });
            }else{
                resumes = resumes.sort((a, b) => {
                return a.orderKey - b.orderKey;
                });
            }
            return resumes
        }catch(err){

        }
    }

    getResumeById = async (resumeId) => {
        try{
        const resume = await this.resumeRepositories.getResumeById(resumeId);
        if(!resume){
            return res.json({ data: {} });
        }
        return resume;
        }catch(err){
        
        }
    }

    createResume = async (user, title, content) => {
        try{
        const createdResume = await this.resumeRepositories.createResume(user, title, content);
        return createdResume;
        }catch(err){
        
        }
    }

    updateResume = async (user, resumeId, title, content, status) => {
        try{
            const resume = await this.resumeRepositories.checkResumeById(resumeId);
        if (!resume) {
            return res.status(401).json({ success: false, message: '존재하지 않는 이력서 입니다.' })
        }
        if (user.grade === 'user' && resume.userId !== user.userId) {
            return res.status(400).json({
                success: false,
                message: '올바르지 않은 요청입니다.',
            })
        }
        const updatedResume = await this.resumeRepositories.updateResume(resumeId, title, content, status);
        return updatedResume;
        }catch(err){
        
        }   
    }
    deleteResume = async (user, resumeId) => {
        try{
            const resume = await this.resumeRepositories.checkResumeById(resumeId);
        if (!resume) {
            return res.status(401).json({ success: false, message: '존재하지 않는 이력서 입니다.' })
        }
        if (user.grade === 'user' && resume.userId !== user.userId) {
            return res.status(400).json({
                success: false,
                message: '올바르지 않은 요청입니다.',
            })
        }
        const deletedResume = await this.resumeRepositories.deleteResume(resumeId);
        return deletedResume;
        }catch(err){
        
        }
    }
}