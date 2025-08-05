import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './Routes/auth.route.js';
import messageRoutes from './Routes/message.route.js';
import { connection } from './config/db.js';
import cors from 'cors';
import {app, server} from './utils/socket.js'
import path from 'path'

const PORT = process.env.PORT || 5000;
const _dirname = path.resolve()

dotenv.config();
app.use(express.json({ limit: '5mb'}))
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}))

app.use('/api/auth/', authRoutes)
app.use('/api/messages/', messageRoutes)

if( process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(_dirname, "../frontend/dist")))

    app.get("*", (req, res) => {
        res.sendFile(path.join(_dirname, '../frontend, "dist", "index.html'))
    })
    
}

app.get('/',(req, res) => {
    res.send("welecome")
})

server.listen(PORT,() => {
    console.log("server started on : http://localhost:5000");
    connection();
})