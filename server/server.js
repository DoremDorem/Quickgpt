import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import connectDb from './config/db.js';
import userRouter from './routes/userRoute.js';
import chatRouter from './routes/chatRoute.js';
import messageRouter from './routes/messageRoute.js';
import creditRouter from './routes/creditRoute.js';
import { stripeWebhooks } from './controllers/webhook.js';
const app=express();
await connectDb();


//stripe webHook
app.post('/api/stripe',express.raw({type:'application/json'}),stripeWebhooks)
//middleware
app.use(cors());
app.use(express.json());
//routes
app.get('/',(req,res)=>{
    res.send('Server is live')
});
app.use('/api/user',userRouter);
app.use('/api/chat',chatRouter);
app.use('/api/message',messageRouter);
app.use('/api/credit',creditRouter);
const port=process.env.PORT || 3000;

app.listen(port,()=>console.log(`server is live on port ${port}`));