"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewImage = exports.Address = exports.Size = exports.Review = exports.Product = exports.Image = exports.Payment = exports.HistoryCart = exports.Cart = exports.User = void 0;
const user_1 = require("./user");
exports.User = user_1.default;
const cart_1 = require("./cart");
exports.Cart = cart_1.default;
const historyCart_1 = require("./historyCart");
exports.HistoryCart = historyCart_1.default;
const payment_1 = require("./payment");
exports.Payment = payment_1.default;
const image_1 = require("./image");
exports.Image = image_1.default;
const product_1 = require("./product");
exports.Product = product_1.default;
const review_1 = require("./review");
exports.Review = review_1.default;
const size_1 = require("./size");
exports.Size = size_1.default;
const address_1 = require("./address");
exports.Address = address_1.default;
const reviewImage_1 = require("./reviewImage");
exports.ReviewImage = reviewImage_1.default;
__exportStar(require("./sequelize"), exports);
const db = {
    User: user_1.default,
    Cart: cart_1.default,
    HistoryCart: historyCart_1.default,
    Payment: payment_1.default,
    Image: image_1.default,
    Product: product_1.default,
    Review: review_1.default,
    Size: size_1.default,
    Address: address_1.default,
    ReviewImage: reviewImage_1.default
};
(0, user_1.associate)(db);
(0, cart_1.associate)(db);
(0, historyCart_1.associate)(db);
(0, image_1.associate)(db);
(0, product_1.associate)(db);
(0, review_1.associate)(db);
(0, size_1.associate)(db);
(0, address_1.associate)(db);
(0, reviewImage_1.associate)(db);
(0, payment_1.associate)(db);
