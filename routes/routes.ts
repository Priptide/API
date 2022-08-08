import  express, {Request, Response, Router} from 'express';
import record from '../models/record';
const router = express.Router()

router.post('/testpost', async(req: Request, res: Response) =>{
    res.send('Post API')
})

export default router as Router
