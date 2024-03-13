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
const passport = require("passport");
const passport_local_1 = require("passport-local");
const user_1 = require("../models/user");
const bcrypt = require("bcrypt");
exports.default = () => {
    passport.use(new passport_local_1.Strategy({
        usernameField: 'email',
        passwordField: 'password',
        session: false,
        passReqToCallback: false,
    }, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield user_1.default.findOne({
                where: { email }
            });
            if (!user) {
                return done(null, false, { message: '존재하지 않는 사용자입니다.' });
            }
            const result = yield bcrypt.compare(password, user.password);
            if (result) {
                return done(null, user);
            }
            return done(null, false, { message: '비밀번호가 틀렸습니다.' });
        }
        catch (error) {
            console.error(error);
            return done(error);
        }
    })));
};
