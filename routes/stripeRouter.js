import express from 'express';
import { checkPayment } from '../controllers/StripeController';




const stripeRouter = express.Router();

stripeRouter.post('/webhook', express.raw({ type: 'application/json' }), checkPayment)