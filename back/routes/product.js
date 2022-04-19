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
const multer = require("multer");
const middlewares_1 = require("./middlewares");
const path = require("path");
const fs = require("fs");
const AWS = require("aws-sdk");
const multerS3 = require("multer-s3");
const models_1 = require("../models");
const sequelize_1 = require("sequelize");
const router = express.Router();
try {
    fs.accessSync('uploads');
}
catch (error) {
    console.log('uploads 폴더가 없으므로 생성합니다.');
    fs.mkdirSync('uploads');
}
AWS.config.update({
    accessKeyId: process.env.AWSAccessKeyId,
    secretAccessKey: process.env.AWSSecretKey,
    region: 'ap-northeast-2',
});
const upload = multer({
    storage: multerS3({
        s3: new AWS.S3(),
        bucket: 'reactshoppingmall-s3',
        key(rep, file, cb) {
            cb(null, `orignal/${Date.now()}_${path.basename(file.originalname)}`);
        }
    }),
    limits: { fileSize: 20 * 1024 * 1024, files: 2 }
});
router.post('/images', middlewares_1.isLoggedIn, upload.array('image'), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('req.files', req.files);
    if (Array.isArray(req.files)) {
        res.json(req.files.map((v) => v.location));
    }
}));
router.post('/', middlewares_1.isLoggedIn, upload.none(), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield models_1.Product.create({
            productName: req.body.productName,
            price: req.body.productPrice,
            stock: req.body.productStock,
            UserId: req.user.id,
        });
        if (req.body.image) {
            const promises = req.body.image.map((image) => models_1.Image.create({
                src: image
            }));
            const images = yield Promise.all(promises);
            yield product.addImages(images);
        }
        if (req.body.productSize) {
            if (Array.isArray(req.body.productSize)) {
                const promises = req.body.productSize.map((size) => models_1.Size.create({
                    option: size
                }));
                const sizes = yield Promise.all(promises);
                yield product.addSizes(sizes);
            }
            else {
                const size = yield models_1.Size.create({
                    option: req.body.productSize
                });
                yield product.addSize(size);
            }
        }
        const fullProduct = yield models_1.Product.findOne({
            where: { id: product.id },
            include: [{
                    model: models_1.Image,
                },
                {
                    model: models_1.Size,
                    attributes: ['option'],
                },]
        });
        res.status(202).json(fullProduct);
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}));
router.get('/name/:spelling', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const SearchProducts = yield models_1.Product.findAll({
            where: {
                productName: {
                    [sequelize_1.Op.like]: "%" + decodeURIComponent(req.params.spelling) + "%"
                }
            },
            attributes: ['id', 'productName']
        });
        res.status(202).json(SearchProducts);
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}));
router.get('/:postId', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let where = {};
        if (parseInt(req.params.postId, 10)) {
            where = {
                id: parseInt(req.params.postId, 10)
            };
        }
        const loadProduct = yield models_1.Product.findOne({
            where,
            include: [{
                    model: models_1.Image
                }, {
                    model: models_1.Review,
                    include: [{
                            model: models_1.User,
                            attributes: ['id', 'email'],
                            include: [{
                                    model: models_1.HistoryCart,
                                    attributes: [
                                        'size', 'quantity'
                                    ],
                                }]
                        }]
                }, {
                    model: models_1.User,
                    attributes: ['id', 'email'],
                    as: 'Likers'
                }, {
                    model: models_1.Size,
                    attributes: ['option']
                }]
        });
        res.status(202).json(loadProduct);
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}));
router.post('/:productId/review', middlewares_1.isLoggedIn, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const exReview = yield models_1.Review.findOne({
            where: { [sequelize_1.Op.and]: [{ ProductId: parseInt(req.params.productId, 10) }, { UserId: req.user.id }, { reviewUnique: req.body.reviewUnique }] },
        });
        if (exReview) {
            return res.status(404).json('이미 작성하신 리뷰가 존재합니다.');
        }
        yield models_1.Review.create({
            content: req.body.content,
            ProductId: parseInt(req.params.productId, 10),
            UserId: req.user.id,
            rate: req.body.rate,
            reviewUnique: req.body.reviewUnique,
        });
        //  사진. 
        const review = yield models_1.Review.findOne({
            where: {
                [sequelize_1.Op.and]: [{ reviewUnique: req.body.reviewUnique }, { ProductId: parseInt(req.params.productId, 10) }, { UserId: req.user.id }]
            },
            attributes: ['reviewUnique', 'id']
        });
        res.status(201).json({ Review: review, });
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}));
exports.default = router;
