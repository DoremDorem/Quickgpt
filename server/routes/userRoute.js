import express from 'express';
import { getPublishedImages, getUser, loginUser, registerUser } from '../controllers/UserController.js';
import { protect } from '../middlewares/Auth.js';
const userRouter=express.Router();
userRouter.post('/register',registerUser);
userRouter.post('/login',loginUser);
userRouter.get('/data',protect,getUser);
userRouter.get('/published-images',protect,getPublishedImages);

export default userRouter;

