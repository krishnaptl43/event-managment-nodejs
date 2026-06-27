import { Router } from 'express';
import { getEvents, addEvent, updateEvent, deleteEvent, cancelEvent, getMyEvents, getEventById } from '../controller/eventController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';
import { eventImageUpload } from '../config/multer.js';

const router = Router();

/* GET users listing. */
router.get('/', getEvents);

// get event by id
router.get('/:eventId', getEventById);

router.use("/admin", authMiddleware, roleMiddleware("admin"));

// my events
router.get('/admin/my-events', getMyEvents);

/* POST users */
router.post('/admin/create', eventImageUpload.fields([{ name: "thumbnail", maxCount: 1 }, { name: "images", maxCount: 6 }]), addEvent);

/* PATCH users */
router.patch('/admin/:eventId', updateEvent);

/* DELETE users */
router.delete('/admin/:eventId', deleteEvent);

/* CANCEL users */
router.patch('/admin/cancel/:eventId', cancelEvent);

export default router;
