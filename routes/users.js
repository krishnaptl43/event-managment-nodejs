import { Router } from 'express';
import { deleteUser, getUsers, registerUser, updateUser } from '../controller/userController.js';
var router = Router();

/* GET users listing. */
router.get('/', getUsers);

/* POST users */
router.post('/', registerUser);

/* PATCH users */
router.patch('/:userId', updateUser);

/* DELETE users */
router.delete('/:userId', deleteUser);


export default router;
