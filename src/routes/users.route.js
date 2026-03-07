import { Router } from 'express';
import userController from '../controllers/user.controller.js';
import validate from '../validators/validate.js';
import { createSchema } from '../validators/user.validate.js';
const router = Router();

router.route('/')
    .get(userController.get)
    .post(validate(createSchema), userController.create)

router.route('/:id')
    .get(userController.find)
export default router