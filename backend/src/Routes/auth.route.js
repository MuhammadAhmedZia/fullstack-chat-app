import express from 'express'
const router = express.Router();
import {signup, login, logout, updateProfile, checkAuth} from '../Controllers/auth.controller.js'
import { protectRoute } from '../Middlewares/auth.middleware.js';


router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.put('/updateprofile', protectRoute, updateProfile);
router.get('/check', protectRoute, checkAuth);


export default router;