module.exports = class resumeRepositories {
    constructor (prisma){
        this.prisma = prisma;
    }

    getResumes = async (orderKey) => {
        try{
        const resumes = await this.prisma.resume.findMany({
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
        return resumes;
        }catch(err){

        }
    }

    getResumeById = async (resumeId) => {
        try{
        const resume = await this.prisma.resume.findFirst({        
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
        return resume;
        }catch(err){

        }
    }

    checkResumeById = async (resumeId) => {
        try{
        const resume = await this.prisma.resume.findFirst({        
            where: {
                resumeId: Number(resumeId),
            },
            select: {
                user: {
                    select: {
                        userId : true,
                    }
                },
            },
        })
        return resume;
        }catch(err){

        }
    }


    createResume = async (user, title, content) => {
        try{
            const createdResume = await this.prisma.resume.create({
                data: {
                    title,
                    content,
                    status: 'APPLY',
                    userId: user.userId,
                }
            });
        return createdResume;
        }catch(err){

        }
    }

    updateResume = async (resumeId, title, content, status) => {
        try{
            const updatedResume = await this.prisma.resume.update({
                where: {
                    resumeId: Number(resumeId),
                },
                data: {
                    title,
                    content,
                    status
                }
            });
            return updatedResume;
        }catch(err){

        }
    }

    deleteResume = async (resumeId) => {
        try{
            const deletedResume = await this.prisma.resume.delete({
                where: {
                    resumeId: Number(resumeId),
                },
            });
            return deletedResume;
        }catch(err){

        }
    }
}