import * as express from 'express';
import * as passport from 'passport';
const router = express.Router();

router.get('/kakao', passport.authenticate('kakao'));
router.get('/kakao/callback', passport.authenticate('kakao', {
    failureRedirect: 'http://localhost:3060/signin',
    }), (req,res) => {
        res.redirect('http://localhost:3060');
    });

export default router;