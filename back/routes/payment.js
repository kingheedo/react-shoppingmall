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
const middlewares_1 = require("./middlewares");
const models_1 = require("../models");
const sequelize_1 = require("sequelize");
const router = express.Router();
/** 결제내역 생성 */
router.post('/', middlewares_1.isLoggedIn, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cartIds, orderId, paymentKey, paymentType, rcName, rcPhone, rcPostNum, rcPostBase, rcPostDetail } = req.body;
        const addPayments = cartIds.map((cartId) => models_1.Payment.create({
            orderId,
            paymentKey,
            paymentType,
            rcName,
            rcPhone,
            rcPostNum,
            rcPostBase,
            rcPostDetail,
            HistoryCartId: cartId,
            UserId: req.user.id,
            isReviewed: false
        }));
        yield Promise.all(addPayments);
        return res.status(201).send('결제 완료');
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}));
/** orderId에 해당하는 결재 내역 */
router.get('/:orderId', middlewares_1.isLoggedIn, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payment = yield models_1.Payment.findAll({
            where: {
                orderId: req.params.orderId
            },
            attributes: {
                exclude: ['HistoryCartId', 'ProductId']
            },
            include: [{
                    model: models_1.HistoryCart,
                    include: [{
                            model: models_1.Product
                        }]
                }]
        });
        return res.status(200).json(payment);
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}));
/** 모든 결제 내역 조회*/
router.get('/', middlewares_1.isLoggedIn, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const startDate = new Date(req.query.startDate).setHours(0, 0, 0, 0);
        const endDate = new Date(req.query.endDate);
        const payments = yield models_1.Payment.findAll({
            where: {
                UserId: req.user.id,
                createdAt: {
                    [sequelize_1.Op.between]: [new Date(startDate).toISOString(), new Date(endDate).toISOString()]
                }
            },
            limit: 10,
            offset: parseInt(req.query.page, 10) * 10,
            order: [
                ['createdAt', 'DESC']
            ],
            attributes: {
                exclude: ['HistoryCartId'],
            },
            include: [{
                    model: models_1.HistoryCart,
                    attributes: {
                        exclude: ['ProductId', 'createdAt', 'updatedAt']
                    },
                    include: [{
                            model: models_1.Product,
                            attributes: {
                                exclude: ['createdAt', 'updatedAt']
                            },
                            include: [{
                                    model: models_1.Image,
                                    attributes: {
                                        exclude: ['ProductId', 'createdAt', 'updatedAt']
                                    },
                                }]
                        }]
                }]
        });
        return res.status(200).json(payments);
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}));
exports.default = router;
