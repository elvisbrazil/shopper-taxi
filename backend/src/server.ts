import express from 'express'
import { Router, Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

const route = Router()

app.use(express.json())

route.get('/', (req: Request, res: Response) => {
  res.json({ message: 'configudrado tasdfasfype' })
})

app.use(route)


const PORT = process.env.NODE_DOCKER_PORT ;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))