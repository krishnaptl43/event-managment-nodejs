import { Router } from 'express';
import { deleteUser, getUsers, registerUser, updateUser, changePassword, getMyProfile, uploadImage } from '../controller/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';
import { userImageUpload } from '../config/multer.js';
var router = Router();

/* GET users listing. */
router.get('/', authMiddleware, roleMiddleware("admin"), getUsers);

router.get('/profile', authMiddleware, roleMiddleware("user"), getMyProfile);

/* POST users */
router.post('/', registerUser);

/* PATCH users */
router.patch('/',authMiddleware, roleMiddleware("admin", "user"), updateUser);

/* DELETE users */
router.delete('/:userId', deleteUser);

// change password
router.post('/change-password', authMiddleware, roleMiddleware("admin", "user"), changePassword);

// user image upload
router.post('/upload-image', authMiddleware, roleMiddleware("admin", "user"), userImageUpload.single("image"), uploadImage)

export default router;
