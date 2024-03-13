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
const passport_naver_1 = require("passport-naver");
const passport = require("passport");
const models_1 = require("../models");
exports.default = () => {
    passport.use(new passport_naver_1.Strategy({
        clientID: process.env.NAVER_ID,
        clientSecret: process.env.NAVER_SECRET,
        callbackURL: '/auth/naver/callback'
    }, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        try {
            console.log('profile', profile);
            const exUser = yield models_1.User.findOne({
                where: {
                    naverId: profile.id,
                    provider: 'naver'
                }
            });
            if (exUser) {
                done(null, exUser);
            }
            else {
                const newUser = yield models_1.User.create({
                    email: (_a = profile._json) === null || _a === void 0 ? void 0 : _a.email,
                    name: profile.displayName || ((_b = profile._json) === null || _b === void 0 ? void 0 : _b.email),
                    naverId: profile.id,
                    provider: 'naver'
                });
                done(null, newUser);
            }
        }
        catch (error) {
            console.error(error);
            return done(error);
        }
    })));
};
