import { Router } from 'express';

import * as controller from '../controllers/appController.js';
import { registerMail } from '../controllers/mailer.js';
import Auth from '../middleware/auth.js';
import { authLimiter, otpLimiter } from '../middleware/rateLimiters.js';

const router = Router();

/** POST methods */
router.route('/register').post(authLimiter, controller.register); // register user
router.route('/registerMail').post(otpLimiter, registerMail); // send the email
router.route('/authenticate').post(authLimiter, controller.verifyUser, (req, res) => res.end()); // check user exists
router.route('/login').post(authLimiter, controller.verifyUser, controller.login); // login

/** GET methods */
router.route('/user/:username').get(controller.getUser); // public profile by username
router.route('/generateOTP').get(otpLimiter, controller.verifyUser, controller.generateOTP); // request OTP
router.route('/verifyOTP').get(otpLimiter, controller.verifyUser, controller.verifyOTP); // verify OTP
router.route('/createResetSession').get(controller.createResetSession); // UI gate for reset page

/** PUT methods */
router.route('/updateuser').put(Auth, controller.updateUser); // update own profile (auth required)
router.route('/resetPassword').put(otpLimiter, controller.verifyUser, controller.resetPassword); // reset password

export default router;
