import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import connectDB from './config/mongodb.js'
import authRouter from './routes/authRoutes.js'
import userRouter from './routes/userRoutes.js'

const app = express()
const PORT = process.env.PORT || 3000
connectDB();

const allowedOrigins = [process.env.Frontend_URL_LOCAL, process.env.Frontend_URL_PRODUCTION]

// Middleware
app.use(express.json())
app.use(cors({origin: allowedOrigins, credentials: true}))
app.use(cookieParser())

// API Endpoints
app.get('/', (req, res) => res.send("API is working!"))
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)

app.listen(PORT, () => {
    console.log("The app is listening on Port " +PORT)
})