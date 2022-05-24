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
            where: { UserId: req.user.id, },
            order: [['updatedAt', 'DESC']],
            include: [{
                    model: models_1.Product,
                    include: [{
                            model: models_1.Image,
                        }],
                }]
        });
        res.status(202).json(fullCartitem);
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}));
router.post('/', middlewares_1.isLoggedIn, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.body.buyNow) {
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
router.delete('/:cartItemId', middlewares_1.isLoggedIn, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield models_1.Cart.destroy({
            where: { [sequelize_1.Op.and]: [{ id: req.params.cartItemId }, { UserId: req.user.id }] },
        });
        res.status(200).json({ CartItemId: parseInt(req.params.cartItemId, 10) });
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}));
exports.default = router;
