const express = require('express');
const { prisma } = require('../utils/prisma/index.js');
const jwtValidate = require('../middlewares/jwt-validate.middleware');
const { resumeController } = require('../controllers/resume.controller.js');
const { resumeService } = require('../services/resume.service.js');
const { resumeRepository } = require('../repositories/resume.repository.js');

const router = express.Router();

const resumeRepository = new resumeRepository(prisma);
const resumeService = new resumeService(resumeRepository);
const resumeController = new resumeController(resumeService);

router.get('/', resumeController.getResumes);
router.get('/:resumeId', resumeController.getResumeById);
router.post('/', jwtValidate, resumeController.createResume);
router.patch('/:resumeId', jwtValidate, resumeController.updateResume);
router.delete('/:resumeId', jwtValidate, resumeController.deleteResume);


module.exports = router;