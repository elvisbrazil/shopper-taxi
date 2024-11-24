import express from 'express';
import { RideController } from '../controllers/rideController';
import { validateRideRequests } from '../middleware/validadeteRequests';
import { RideHistoryController } from '../controllers/rideHistoryController';

const router = express.Router();
const rideController = new RideController();
const rideHistoryController = new RideHistoryController();

router.post('/estimate', validateRideRequests, rideController.estimateRide.bind(rideController));
router.patch('/confirm', rideController.confirmRide.bind(rideController));
router.get('/:customer_id', rideHistoryController.getRidesByUser.bind(rideHistoryController));

export default router;