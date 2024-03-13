import * as express from 'express';
import * as passport from 'passport';
const router = express.Router();

router.get('/kakao', passport.authenticate('kakao'));
router.get('/kakao/callback', passport.authenticate('kakao', {
    failureRedirect: 'http://localhost:3060/signIn',
    }), (req,res) => {
        res.redirect('http://localhost:3060');
    });
router.get('/naver', passport.authenticate('naver'));
router.get('/naver/callback', passport.authenticate('naver', {
    failureRedirect: 'http://localhost:3060/signIn',
    }), (req,res) => {
        res.redirect('http://localhost:3060');
    });


export default router;