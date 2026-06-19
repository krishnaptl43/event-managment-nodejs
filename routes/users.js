import { Router } from 'express';
import { deleteUser, getUsers, registerUser, updateUser,changePassword } from '../controller/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';
var router = Router();

/* GET users listing. */
router.get('/', authMiddleware, roleMiddleware("admin"), getUsers);

/* POST users */
router.post('/', registerUser);

/* PATCH users */
router.patch('/:userId', updateUser);

/* DELETE users */
router.delete('/:userId', deleteUser);

// change password
router.post('/change-password', authMiddleware, roleMiddleware("admin","user"), changePassword);


export default router;
