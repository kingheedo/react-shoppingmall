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
const passport = require("passport");
const path = require("path");
const fs = require("fs");
const middlewares_1 = require("./middlewares");
const models_1 = require("../models");
const multer = require("multer");
const multerS3 = require("multer-s3");
const client_s3_1 = require("@aws-sdk/client-s3");
const router = express.Router();
try {
    fs.accessSync('uploads');
}
catch (error) {
    console.log('uploads 폴더가 없으므로 생성합니다.');
    fs.mkdirSync('uploads');
}
/** 상품 삭제 */
router.delete('/product/:productId', middlewares_1.isLoggedIn, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield models_1.Product.destroy({
            where: {
                id: req.params.productId
            }
        });
        return res.status(200).send('상품이 삭제되었습니다.');
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}));
// 이미지 로컬 저장
// const upload = multer({
//     storage: multer.diskStorage({
//         destination: (req,file,cb) => {
//             cb(null, 'uploads')
//         },
//         filename: (req,file,cb) => {
//             cb(null, `${file.fieldname} - ${Date.now()}`)
//         },
//     }),
//     limits: {
//         fileSize : 20 * 1024 * 1024, files: 2
//     }
// })
/** multer에서 s3접근 */
const s3 = new client_s3_1.S3Client({
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
    region: 'ap-northeast-2',
});
// /** multer에서 s3업로드 설정 */
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.BUCKET_NAME,
        key: (req, file, cb) => {
            cb(null, `original/${Date.now()}_${path.basename(file.originalname)}`);
        }
    }),
    limits: { fileSize: 20 * 1024 * 1024 },
});
/** 이미지 s3 추가 */
router.post('/product/images', middlewares_1.isLoggedIn, upload.array('image'), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log('req.files',req.files);
    if (Array.isArray(req.files)) {
        return res.json(req.files.map((v) => v.location));
    }
}));
// router.post('/product/images', isLoggedIn, upload.array('image'), async(req, res, next) => {
//     // console.log('req.files',req.files);
//     if(Array.isArray(req.files)){
//      return res.json((req.files as Express.Multer.File[]).map((v) => v.filename))
//     }
// })
/** 상품 추가 */
router.post('/product', middlewares_1.isLoggedIn, upload.none(), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let product;
        if ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) {
            product = yield models_1.Product.create({
                productName: req.body.productName,
                price: req.body.price,
                stock: req.body.stock,
                sex: req.body.sex,
                UserId: req.user.id,
            });
        }
        if (req.body.images && product) {
            const promises = req.body.images.map((image) => models_1.Image.create({
                src: image
            }));
            const images = yield Promise.all(promises);
            yield product.addImages(images);
        }
        if (req.body.sizes && product) {
            if (Array.isArray(req.body.sizes)) {
                const promises = req.body.sizes.map((size) => models_1.Size.create({
                    option: size
                }));
                const sizes = yield Promise.all(promises);
                yield product.addSizes(sizes);
            }
            else {
                const size = yield models_1.Size.create({
                    option: req.body.sizes
                });
                yield product.addSize(size);
            }
        }
        let fullProduct;
        if (product === null || product === void 0 ? void 0 : product.id) {
            fullProduct = yield models_1.Product.findOne({
                where: { id: product.id },
                include: [{
                        model: models_1.Image,
                    },
                    {
                        model: models_1.Size,
                        attributes: ['option'],
                    },]
            });
        }
        return res.status(202).json(fullProduct);
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}));
/** 상품 정보 수정 */
router.patch('/product', middlewares_1.isLoggedIn, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.body.sizes.length === 0) {
            return res.status(404).send('사이즈를 선택해주세요');
        }
        if (req.body.images.length === 0) {
            return res.status(404).send('이미지를 선택해주세요');
        }
        const product = yield models_1.Product.findOne({
            where: {
                id: req.body.id
            }
        });
        /** 상품 이름, 가격, 재고, 성별 수정 */
        yield (product === null || product === void 0 ? void 0 : product.update({
            productName: req.body.productName,
            price: req.body.price,
            stock: req.body.stock,
            sex: req.body.sex,
        }));
        /** 사이즈 수정 */
        const sizes = yield models_1.Size.findAll({
            where: {
                ProductId: product === null || product === void 0 ? void 0 : product.id
            }
        });
        const options = sizes.map(val => val.option);
        const addSizePromises = req.body.sizes.map(size => {
            if (!options.includes(size)) {
                return models_1.Size.create({
                    option: size,
                    ProductId: product === null || product === void 0 ? void 0 : product.id
                });
            }
        });
        const destroySizePromises = options.map(option => {
            if (!req.body.sizes.includes(option)) {
                return models_1.Size.destroy({
                    where: {
                        option: option,
                        ProductId: product === null || product === void 0 ? void 0 : product.id
                    }
                });
            }
        });
        yield Promise.all([...addSizePromises, ...destroySizePromises]);
        /** 이미지 경로 수정 */
        const images = yield models_1.Image.findAll({
            where: {
                ProductId: product === null || product === void 0 ? void 0 : product.id
            }
        });
        const updateImagePromises = images.map((image, idx) => {
            if (req.body.images[idx] !== image.src) {
                return models_1.Image.update({
                    src: req.body.images[idx],
                }, {
                    where: {
                        src: image.src,
                        ProductId: product === null || product === void 0 ? void 0 : product.id
                    },
                });
            }
        });
        yield Promise.all([...updateImagePromises]);
        return res.status(200).send('수정 완료');
    }
    catch (error) {
        next(error);
        console.error(error);
    }
}));
/** 상품 정보들 가져오기 */
router.get('/products', middlewares_1.isLoggedIn, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productList = yield models_1.Product.findAll({
            include: [{
                    model: models_1.Image,
                    attributes: ['src']
                },
                {
                    model: models_1.Size,
                    attributes: ['option']
                }],
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        });
        return res.status(200).json(productList);
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}));
/** 관리자 정보 가져오기*/
router.get('/user', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        if (req.user) {
            const user = yield models_1.User.findOne({
                where: {
                    id: (_b = req.user) === null || _b === void 0 ? void 0 : _b.id
                },
                attributes: ['id', 'email', 'name', 'level',]
            });
            return res.status(200).json(user);
        }
        else {
            return res.status(200).json(null);
        }
    }
    catch (error) {
        next(error);
        console.error(error);
    }
}));
/** 로그인 요청 */
router.post('/user/login', middlewares_1.isNotLoggedIn, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.body.email !== 'admin@admin.com') {
            return res.status(404).send('이메일을 다시 확인해주세요');
        }
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
}));
/** 로그아웃 */
router.post('/user/logout', middlewares_1.isLoggedIn, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.logOut((err) => {
            if (err) {
                console.error(err);
                return next(err);
            }
            else {
                res.redirect('/');
            }
        });
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}));
exports.default = router;
