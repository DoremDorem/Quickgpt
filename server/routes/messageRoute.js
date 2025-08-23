import express from 'express';
import { protect } from '../middlewares/Auth.js';
import { imageMessageContainer, textMessageController } from '../controllers/messageController.js';
const messageRouter=express.Router();
messageRouter.post('/text',protect,textMessageController);
messageRouter.post('/image',protect,imageMessageContainer);
export default messageRouter;