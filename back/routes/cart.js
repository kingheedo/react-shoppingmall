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
const sequelize_1 = require("sequelize");
const models_1 = require("../models");
const middlewares_1 = require("./middlewares");
const router = express.Router();
router.get('/', middlewares_1.isLoggedIn, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fullCartitem = yield models_1.Cart.findAll({
            where: { UserId: req.user.id },
            order: [['updatedAt', 'DESC']],
            attributes: ['id', 'quantity', 'size', 'totalPrice'],
            include: [{
                    model: models_1.Product,
                    attributes: {
                        exclude: ['UserId', 'createdAt', 'updatedAt'],
                    },
                    include: [{
                            model: models_1.Image,
                            attributes: ['src']
                        },
                        {
                            model: models_1.Size,
                            attributes: ['option']
                        }
                    ]
                }]
        });
        return res.status(202).json(fullCartitem);
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}));
router.post('/', middlewares_1.isLoggedIn, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.body.buyNow) {
            // 지금 바로 구매 시
            const exCartItem = yield models_1.Cart.findOne({
                where: { [sequelize_1.Op.and]: [{ UserId: req.user.id, ProductId: req.body.productId }, { size: req.body.size }] },
            });
            if (exCartItem) {
                const findHistoryCart = yield models_1.HistoryCart.findOne({
                    where: {
                        quantity: exCartItem.quantity,
                        totalPrice: exCartItem.totalPrice,
                        size: exCartItem.size,
                        UserId: exCartItem.UserId,
                        ProductId: exCartItem.ProductId,
                    }
                });
                yield models_1.Cart.update({
                    totalPrice: req.body.totalPrice,
                    quantity: req.body.quantity
                }, {
                    where: { [sequelize_1.Op.and]: [{ UserId: req.user.id, ProductId: req.body.productId }, { size: req.body.size },] },
                }),
                    yield models_1.HistoryCart.update({
                        totalPrice: req.body.totalPrice,
                        quantity: req.body.quantity
                    }, {
                        where: { [sequelize_1.Op.and]: [{ UserId: req.user.id, ProductId: req.body.productId }, { size: req.body.size }, { id: findHistoryCart.id }] },
                    });
            }
            else {
                yield models_1.Cart.create({
                    UserId: req.user.id,
                    ProductId: parseInt(req.body.productId, 10),
                    size: req.body.size,
                    totalPrice: req.body.totalPrice,
                    quantity: req.body.quantity
                });
                yield models_1.HistoryCart.create({
                    UserId: req.user.id,
                    ProductId: parseInt(req.body.productId, 10),
                    size: req.body.size,
                    totalPrice: req.body.totalPrice,
                    quantity: req.body.quantity
                });
            }
            const fullCartitem = yield models_1.Cart.findOne({
                where: { [sequelize_1.Op.and]: [{ UserId: req.user.id, ProductId: req.body.productId }, { size: req.body.size }] },
                include: [{
                        model: models_1.Product,
                        include: [{
                                model: models_1.Image,
                            }]
                    }]
            });
            return res.status(202).json(fullCartitem);
        }
        else {
            //장바구니에 담을 시
            const exCartItem = yield models_1.Cart.findOne({
                where: {
                    [sequelize_1.Op.and]: [{
                            UserId: req.user.id,
                            ProductId: req.body.productId
                        }, {
                            size: req.body.size
                        }]
                },
            });
            if (exCartItem) {
                const findHistoryCart = yield models_1.HistoryCart.findOne({
                    where: {
                        quantity: exCartItem.quantity,
                        totalPrice: exCartItem.totalPrice,
                        size: exCartItem.size,
                        UserId: exCartItem.UserId,
                        ProductId: exCartItem.ProductId,
                    }
                });
                yield models_1.Cart.increment({
                    totalPrice: req.body.totalPrice,
                    quantity: req.body.quantity
                }, {
                    where: { [sequelize_1.Op.and]: [{ UserId: req.user.id, ProductId: req.body.productId }, { size: req.body.size },] },
                });
                yield models_1.HistoryCart.increment({
                    totalPrice: req.body.totalPrice,
                    quantity: req.body.quantity
                }, {
                    where: { [sequelize_1.Op.and]: [{ UserId: req.user.id, ProductId: req.body.productId }, { size: req.body.size }, { id: findHistoryCart.id }] },
                });
            }
            else {
                // Cart와 HistoryCart에 새로운 상품 추가
                yield models_1.Cart.create({
                    UserId: req.user.id,
                    ProductId: parseInt(req.body.productId, 10),
                    size: req.body.size,
                    totalPrice: req.body.totalPrice,
                    quantity: req.body.quantity
                }),
                    yield models_1.HistoryCart.create({
                        UserId: req.user.id,
                        ProductId: parseInt(req.body.productId, 10),
                        size: req.body.size,
                        totalPrice: req.body.totalPrice,
                        quantity: req.body.quantity
                    });
            }
            const fullCartitem = yield models_1.Cart.findOne({
                where: { [sequelize_1.Op.and]: [{ UserId: req.user.id, ProductId: req.body.productId }, { size: req.body.size }] },
                include: [{
                        model: models_1.Product,
                        include: [{
                                model: models_1.Image,
                            }]
                    }]
            });
            res.status(202).json(fullCartitem);
        }
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}));
router.post('/change', middlewares_1.isLoggedIn, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const exCart = yield models_1.Cart.findOne({
            where: {
                id: req.body.id,
                ProductId: req.body.productId,
                UserId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id
            }
        });
        const exHistoryCart = yield models_1.HistoryCart.findOne({
            where: {
                id: req.body.id,
                ProductId: req.body.productId,
                UserId: (_b = req.user) === null || _b === void 0 ? void 0 : _b.id
            }
        });
        yield (exCart === null || exCart === void 0 ? void 0 : exCart.update({
            size: req.body.size,
            quantity: req.body.quantity,
            totalPrice: req.body.totalPrice
        }));
        yield (exHistoryCart === null || exHistoryCart === void 0 ? void 0 : exHistoryCart.update({
            size: req.body.size,
            quantity: req.body.quantity,
            totalPrice: req.body.totalPrice
        }));
        res.status(200).send('정상 변경되었습니다.');
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}));
router.delete('/', middlewares_1.isLoggedIn, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('req.body.ids', req.body);
        yield models_1.Cart.destroy({
            where: { [sequelize_1.Op.and]: [{ id: [...req.body.ids] }, { UserId: req.user.id }] },
        });
        res.status(200).send('아이템이 삭제되었습니다');
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}));
exports.default = router;
