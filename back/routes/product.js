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
const path = require("path");
const multer = require("multer");
const multerS3 = require("multer-s3");
const client_s3_1 = require("@aws-sdk/client-s3");
const router = express.Router();
/** multer에서 s3접근 */
const s3 = new client_s3_1.S3Client({
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
    region: 'ap-northeast-2',
});
/** multer에서 s3업로드 설정 */
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.BUCKET_NAME,
        key: (req, file, cb) => {
            cb(null, `review/${Date.now()}_${path.basename(file.originalname)}`);
        }
    }),
    limits: { fileSize: 20 * 1024 * 1024 },
});
router.get('/search', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const SearchProducts = yield models_1.Product.findAll({
            where: {
                productName: {
                    [sequelize_1.Op.like]: "%" + req.query.keyword + "%"
                }
            },
            attributes: ['id', 'productName']
        });
        return res.status(202).json(SearchProducts);
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}));
router.get('/:productId', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let where = {};
        if (parseInt(req.params.productId, 10)) {
            where = {
                id: parseInt(req.params.productId, 10)
            };
        }
        let result = [];
        const loadProduct = yield models_1.Product.findOne({
            where,
            include: [{
                    model: models_1.Image
                },
                {
                    model: models_1.User,
                    attributes: ['id', 'email'],
                    as: 'Likers'
                }, {
                    model: models_1.Size,
                    attributes: ['option']
                }],
        });
        const reviews = yield models_1.Review.findAll({
            where: {
                ProductId: parseInt(req.params.productId, 10)
            },
            include: [{
                    model: models_1.User,
                    attributes: ['email'],
                    include: [{
                            model: models_1.HistoryCart,
                            attributes: ['quantity', 'totalPrice', 'size'],
                            where: {
                                ProductId: parseInt(req.params.productId, 10)
                            },
                            through: {
                                attributes: [
                                    'isReviewed'
                                ],
                                where: {
                                    isReviewed: true
                                }
                            }
                        }],
                }, {
                    model: models_1.ReviewImage,
                    attributes: ['src']
                }]
        });
        return res.status(202).json(Object.assign(Object.assign({}, loadProduct === null || loadProduct === void 0 ? void 0 : loadProduct.get()), { Reviews: reviews }));
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}));
/** 로컬 리뷰 이미지 추가 */
// router.post('/review/images', isLoggedIn, upload.array('image'), async(req, res, next) => {
//     console.log('req.files', req.files);
//     if(Array.isArray(req.files)){
//         return res.json((req.files as Express.Multer.File[]).map(v => v.filename))
//     }
// })
/** s3에 리뷰이미지 추가 */
router.post('/review/images', middlewares_1.isLoggedIn, upload.array('image'), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('req.files', req.files);
    if (Array.isArray(req.files)) {
        return res.json(req.files.map(v => v.location));
    }
}));
router.post('/:productId/review', middlewares_1.isLoggedIn, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const review = yield models_1.Review.create({
            content: req.body.content,
            rate: req.body.rate,
            ProductId: req.params.productId,
            UserId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id
        });
        if (review && Array.isArray(req.body.image) && req.body.image.length > 0) {
            const promise = req.body.image.map((src) => models_1.ReviewImage.create({
                src: src
            }));
            const reviewImages = yield Promise.all(promise);
            yield review.addReviewImages(reviewImages);
        }
        const payment = yield models_1.Payment.findOne({
            where: {
                id: req.body.paymentId
            }
        });
        yield (payment === null || payment === void 0 ? void 0 : payment.update({
            isReviewed: true
        }));
        return res.status(201).send('리뷰 작성 완료');
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}));
router.post('/like/:productId', middlewares_1.isLoggedIn, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const productId = parseInt(req.params.productId, 10);
        const product = yield models_1.Product.findOne({
            where: {
                id: productId
            }
        });
        product === null || product === void 0 ? void 0 : product.addLikers((_b = req.user) === null || _b === void 0 ? void 0 : _b.id);
        return res.status(201).json('좋아요를 눌렀습니다.');
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}));
router.post('/unlike/:productId', middlewares_1.isLoggedIn, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = parseInt(req.params.productId, 10);
        const product = yield models_1.Product.findOne({
            where: {
                id: productId
            }
        });
        if (product) {
            yield product.removeLikers(req.user.id);
            return res.status(201).json('좋아요 취소');
        }
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}));
exports.default = router;
