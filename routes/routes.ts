import  express, {Request, Response, Router} from 'express';
import record from '../models/record';
const router = express.Router()

router.get('/post', (req, res) => {
    res.send('GET API');
})
router.post('/post', (req, res) => {
    res.send('Post API');
})

export default router
