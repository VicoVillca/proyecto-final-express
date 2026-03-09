import { Router } from 'express';
import userController from '../controllers/user.controller.js';
import validate from '../validators/validate.js';
import { schema } from '../validators/user.validate.js';
import { autentificateToken } from '../middlewares/authenticate.middleware.js';
const router = Router();

router.route('/')
    .get(userController.get)
    .post(validate(schema), userController.create)

router.route('/:id')
    .get(autentificateToken, userController.find)
    .put(autentificateToken, validate(schema), userController.update)
    .patch(autentificateToken, userController.activeInactive)
    .delete(autentificateToken, userController.eliminar)

router.route('/:id/tasks')
    .get(autentificateToken, userController.getTasks)

router.get('/list/pagination', userController.listWithPagination);
export default router