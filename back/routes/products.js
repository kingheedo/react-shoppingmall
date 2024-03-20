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
const { Op } = require('sequelize');
const models_1 = require("../models");
const router = express.Router();
router.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let where = {};
        if (parseInt(req.query.id, 10)) {
            where = {
                id: { [Op.gt]: parseInt(req.query.id, 10) }
            };
        }
        const products = yield models_1.Product.findAll({
            where,
            limit: 4,
            order: [['id', 'ASC']],
            include: [{
                    model: models_1.Image,
                },
                {
                    model: models_1.User,
                    through: {
                        attributes: []
                    },
                    attributes: ['id'],
                    as: 'Likers'
                }]
        });
        return res.status(202).json(products);
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}));
exports.default = router;
