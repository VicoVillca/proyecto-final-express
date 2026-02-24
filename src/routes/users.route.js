import { Router } from 'express';
import userController from '../controllers/user.controller.js';
const router = Router();

router.route('/').get(userController.getPrueba)

export default router