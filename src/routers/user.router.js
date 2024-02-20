const express = require('express');
const { prisma } = require('../utils/prisma/index.js');
const jwtValidate = require('../middlewares/jwt-validate.middleware');
const { userController } = require('../controllers/user.controller.js');
const { userService } = require('../services/user.service.js');
const { userRepository } = require('../repositories/user.repository.js');

const router = express.Router();

const userRepository = new userRepository(prisma);
const userService = new userService(userRepository);
const userController = new userController(userService);

/** Access토큰, Refresh토큰 발급 API **/
router.post('/sign-up', userController.signUp);
router.post('/sign-in', userController.signIn);
router.get('/me', jwtValidate, userController.me);

module.exports = router;