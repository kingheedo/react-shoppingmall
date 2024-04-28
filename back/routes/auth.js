"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const passport = require("passport");
const router = express.Router();
const production = process.env.NODE_ENV === 'production';
router.get('/kakao', passport.authenticate('kakao'));
router.get('/kakao/callback', passport.authenticate('kakao', {
    failureRedirect: production ? 'https://next-react.shop/signIn' : 'http://localhost:3060/signIn',
}), (req, res) => {
    return res.redirect(production ? 'https://next-react.shop' : 'http://localhost:3060');
});
router.get('/naver', passport.authenticate('naver'));
router.get('/naver/callback', passport.authenticate('naver', {
    failureRedirect: production ? 'https://next-react.shop/signIn' : 'http://localhost:3060/signIn',
}), (req, res) => {
    return res.redirect(production ? 'https://next-react.shop' : 'http://localhost:3060');
});
exports.default = router;
