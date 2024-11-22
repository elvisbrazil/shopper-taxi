import { Router } from 'express';
import RideController from '../controllers/rideController';
import validateRequest from '../middlewares/validateRequest';

const router = Router();

router.post('/estimate', validateRequest, RideController.estimate);
router.post('/confirm', validateRequest, RideController.confirm);

export default router;