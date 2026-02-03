import { Router } from 'express';

const router: Router = Router();

router.get('/register', (req, res) => {
    res.send('Register route');
});


