const express = require('express');
const { prisma } = require('../utils/prisma/index.js');
const { authController } = require('../controllers/auth.controller.js');
const { authService } = require('../services/auth.service.js');
const { authRepository } = require('../repositories/auth.repository.js');

const router = express.Router();

const authRepository = new PostsRepository(prisma);
const authService = new PostsService(authRepository);
const authController = new authController(authService);

/** Access토큰, Refresh토큰 발급 API **/
router.post('/', authController.tokenPost);

module.exports = router;