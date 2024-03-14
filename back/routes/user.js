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
const express = require("express");
const models_1 = require("../models");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
const middlewares_1 = require("./middlewares");
const sequelize_1 = require("sequelize");
router.get('/paymentsList', middlewares_1.isLoggedIn, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const paymentLists = yield models_1.Payment.findAll({
            order: [['createdAt', 'DESC']],
            where: { UserId: req.user.id },
            include: [{
                    model: models_1.HistoryCart,
                    include: [{
                            model: models_1.Product,
                            include: [{
                                    model: models_1.Image
                                },]
                        }, {
                            model: models_1.User,
                            include: [{
                                    model: models_1.Review,
                                }],
                            attributes: ['id', 'email']
                        }]
                }]
        });
        return res.status(202).json(paymentLists);
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}));
router.post('/logout', middlewares_1.isLoggedIn, (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            console.error(err);
            return next(err);
        }
        else {
            res.redirect('/');
            return res.status(201).send('로그아웃 완료.');
        }
    });
    // req.session.destroy(() =>{
    //     return res.status(201).send('로그아웃 완료.')
    // });
});
router.get('/address', middlewares_1.isLoggedIn, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const getAddresses = yield models_1.Address.findAll({
            where: {
                UserId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id
            }
        });
        res.status(200).json(getAddresses);
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}));
router.post('/address', middlewares_1.isLoggedIn, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.body.rcPostNum && req.body.rcPostBase && req.body.rcPostDetail) {
            const address = yield models_1.Address.findOne({
                where: {
                    [sequelize_1.Op.and]: [
                        { rcPostNum: req.body.rcPostNum },
                        { rcPostBase: req.body.rcPostBase },
                        { rcPostDetail: req.body.rcPostDetail }
                    ]
                }
            });
            if (address) {
                return res.status(200).send('이미 존재하는 주소입니다.');
            }
        }
        ;
        const createdAddress = yield models_1.Address.create({
            rcName: req.body.rcName,
            rcPhone: req.body.rcPhone,
            rcPostNum: req.body.rcPostNum,
            rcPostBase: req.body.rcPostBase,
            rcPostDetail: req.body.rcPostDetail,
            UserId: req.user.id
        });
        if (req.body.base && createdAddress) {
            yield models_1.User.update({
                addressId: createdAddress.id
            }, {
                where: {
                    id: req.user.id
                }
            });
        }
        return res.status(200).send('주소 추가 완료');
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}));
router.patch('/address', middlewares_1.isLoggedIn, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield models_1.Address.update({
            rcName: req.body.rcName,
            rcPhone: req.body.rcPhone,
            rcPostNum: req.body.rcPostNum,
            rcPostBase: req.body.rcPostBase,
            rcPostDetail: req.body.rcPostDetail,
        }, {
            where: {
                id: req.body.id,
                UserId: req.user.id
            }
        });
        if (req.body.base && req.body.id) {
            yield models_1.User.update({
                addressId: req.body.id
            }, {
                where: {
                    id: req.user.id
                }
            });
        }
        return res.status(200).send('배송지 수정완료');
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}));
router.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.user) {
            const info = yield models_1.User.findOne({
                where: { id: req.user.id },
                attributes: {
                    exclude: ['password', 'createdAt', 'updatedAt']
                }
            });
            const cartLength = yield models_1.Cart.count({
                where: { UserId: req.user.id }
            });
            const address = yield models_1.Address.findOne({
                where: {
                    id: info === null || info === void 0 ? void 0 : info.addressId,
                    UserId: req.user.id
                },
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'UserId']
                }
            });
            let userInfo = {};
            if (address) {
                userInfo = {
                    info,
                    cartLength,
                    address
                };
            }
            else {
                userInfo = {
                    info,
                    cartLength,
                };
            }
            return res.status(200).json(userInfo);
        }
        else {
            return res.status(200).json(null);
        }
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}));
router.post('/login', middlewares_1.isNotLoggedIn, (req, res, next) => {
    try {
        passport.authenticate('local', (err, user, info) => {
            if (err) {
                console.error(err);
                return next(err);
            }
            if (info) {
                return res.status(401).send(info.message);
            }
            return req.logIn(user, (loginErr) => __awaiter(void 0, void 0, void 0, function* () {
                if (loginErr) {
                    console.error(loginErr);
                    return next(loginErr);
                }
                const withOutPasswordUser = yield models_1.User.findOne({
                    where: { id: user.id },
                    attributes: {
                        exclude: ['password']
                    }
                });
                return res.status(201).json(withOutPasswordUser);
            }));
        })(req, res, next);
    }
    catch (error) {
        next(error);
        console.error(error);
    }
});
router.post('/', middlewares_1.isNotLoggedIn, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const exUser = yield models_1.User.findOne({
            where: { email: req.body.email }
        });
        if (exUser) {
            return res.status(403).send('이미 존재하는 이메일 입니다.');
        }
        const exName = yield models_1.User.findOne({
            where: { name: req.body.name }
        });
        if (exName) {
            return res.status(403).send('이미 존재하는 이름 입니다.');
        }
        const hashedPassword = yield bcrypt.hash(req.body.password, 12);
        yield models_1.User.create({
            email: req.body.email,
            name: req.body.name,
            password: hashedPassword,
        });
        res.status(201).send('회원가입 성공');
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}));
router.post('/payment', middlewares_1.isLoggedIn, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.body.CartItemId) {
            const findCart = yield models_1.Cart.findOne({
                where: { id: req.body.CartItemId }
            });
            console.log('findCart', findCart);
            if (findCart) {
                const findHistoryCart = yield models_1.HistoryCart.findOne({
                    where: {
                        quantity: findCart.quantity,
                        totalPrice: findCart.totalPrice,
                        size: findCart.size,
                        UserId: findCart.UserId,
                        ProductId: findCart.ProductId,
                    }
                });
                if (findHistoryCart) {
                    yield models_1.Payment.create({
                        cancelled: req.body.payment.cancelled,
                        email: req.body.payment.email,
                        paid: req.body.payment.paid,
                        payerID: req.body.payment.payerID,
                        paymentID: req.body.payment.paymentID,
                        paymentToken: req.body.payment.paymentToken,
                        returnUrl: req.body.payment.returnUrl,
                        createdAt: req.body.payment.createdAt,
                        updatedAt: req.body.payment.updatedAt,
                        UserId: req.user.id,
                        HistoryCartId: findHistoryCart.id
                    });
                }
                yield models_1.Cart.destroy({
                    where: { [sequelize_1.Op.and]: [{ id: req.body.CartItemId }, { UserId: req.user.id }] },
                });
                return res.status(200).send('결제성공');
            }
        }
        if (req.body.CartItemsId) {
            const findCarts = yield models_1.Cart.findAll({
                where: { [sequelize_1.Op.and]: [{ id: req.body.CartItemsId }, { UserId: req.user.id }] },
                order: [['id', 'DESC']],
            });
            const findHistoryCarts = yield models_1.HistoryCart.findAll({
                where: {
                    [sequelize_1.Op.or]: findCarts.map(v => ({
                        quantity: v.quantity,
                        totalPrice: v.totalPrice,
                        size: v.size,
                        UserId: req.user.id,
                        ProductId: v.ProductId,
                        createdAt: v.createdAt,
                    }))
                },
                attributes: ['id'],
                order: [['id', 'DESC']],
            });
            if (findHistoryCarts) {
                yield Promise.all(findHistoryCarts.map((cartItemId, i) => {
                    models_1.Payment.create({
                        cancelled: req.body.payment.cancelled,
                        email: req.body.payment.email,
                        paid: req.body.payment.paid,
                        payerID: req.body.payment.payerID,
                        paymentID: req.body.payment.paymentID,
                        paymentToken: req.body.payment.paymentToken,
                        returnUrl: req.body.payment.returnUrl,
                        createdAt: req.body.payment.createdAt,
                        updatedAt: req.body.payment.updatedAt,
                        UserId: req.user.id,
                        HistoryCartId: findHistoryCarts[i].id
                    });
                }));
                yield models_1.Cart.destroy({
                    where: { [sequelize_1.Op.and]: [{ id: req.body.CartItemsId }, { UserId: req.user.id }] },
                });
                return res.status(200).send('결제성공');
            }
        }
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}));
exports.default = router;
