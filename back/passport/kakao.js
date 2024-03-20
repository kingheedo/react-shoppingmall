"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_kakao_1 = require("passport-kakao");
const user_1 = require("../models/user");
const passport = require("passport");
exports.default = () => {
    passport.use(new passport_kakao_1.Strategy({
        clientID: process.env.KAKAO_ID,
        callbackURL: '/auth/kakao/callback',
    }, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        console.log('profile', profile);
        try {
            console.log('passport');
            const exUser = yield user_1.default.findOne({
                where: {
                    kakaoId: profile.id,
                    provider: 'kakao'
                }
            });
            if (exUser) {
                console.log('exUser', exUser);
                return done(null, exUser);
            }
            else {
                const newUser = yield user_1.default.create({
                    email: (_a = profile._json) === null || _a === void 0 ? void 0 : _a.kakao_account.email,
                    name: profile.displayName,
                    kakaoId: profile.id,
                    provider: 'kakao'
                });
                console.log('newUser', newUser);
                return done(null, newUser);
            }
        }
        catch (error) {
            console.log('error');
            console.error(error);
            return done(error);
        }
    })));
};
