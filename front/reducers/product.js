import faker from 'faker'
import produce from 'immer'
export const initialState = {
    mainProducts: [],
    singleProduct: null,
    imagePath: [],
    hasMoreProducts : true,
    registerProductLoading: false,
    registerProductDone: false,
    registerProductErrors: null,
    uploadImagesLoading: false,
    uploadImagesDone: false,
    uploadImagesErrors: null,
    loadMainProductsLoading : false,
    loadMainProductsDone : false,
    loadMainProductsError : null,
    addProductReviewLoading: false,
    addProductReviewDone: false,
    addProductReviewError: false,

}

export const REMOVE_IMAGE = 'REMOVE_IMAGE';

export const REGISTER_PRODUCT_REQUEST = 'REGISTER_PRODUCT_REQUEST';
export const REGISTER_PRODUCT_SUCCESS = 'REGISTER_PRODUCT_SUCCESS';
export const REGISTER_PRODUCT_FAILURE = 'REGISTER_PRODUCT_FAILURE';

export const UPLOAD_IMAGES_REQUEST = 'UPLOAD_IMAGES_REQUEST';
export const UPLOAD_IMAGES_SUCCESS = 'UPLOAD_IMAGES_SUCCESS';
export const UPLOAD_IMAGES_FAILURE = 'UPLOAD_IMAGES_FAILURE';

export const ADD_PRODUCT_REVIEW_REQUEST = 'ADD_PRODUCT_REVIEW_REQUEST';
export const ADD_PRODUCT_REVIEW_SUCCESS = 'ADD_PRODUCT_REVIEW_SUCCESS';
export const ADD_PRODUCT_REVIEW_FAILURE = 'ADD_PRODUCT_REVIEW_FAILURE';

export const LOAD_PRODUCT_REQUEST = 'LOAD_PRODUCT_REQUEST';
export const LOAD_PRODUCT_SUCCESS = 'LOAD_PRODUCT_SUCCESS';
export const LOAD_PRODUCT_FAILURE = 'LOAD_PRODUCT_FAILURE';

export const LOAD_PRODUCTS_REQUEST = 'LOAD_PRODUCTS_REQUEST';
export const LOAD_PRODUCTS_SUCCESS = 'LOAD_PRODUCTS_SUCCESS';
export const LOAD_PRODUCTS_FAILURE = 'LOAD_PRODUCTS_FAILURE';

export const dummyProduct  = (productId, size, quantity, totalPrice) =>  (
    {
        id : productId,
        quantity : quantity,
        productName: '★인기재입고★ 스카이 블루 퀼팅 경량 리사이클 패딩 점퍼'
        ,
        price : 100,
        totalPrice : totalPrice,
        Reviews:[
            {
                id :2,
                content: '이거 좋아요',
                User : {
                    email: 'gmlehdhkd@naver.com'
                },
                rate: 2,

            },
            {
                id :5,
                content: '이거 좋아요2',
                User : {
                    email: 'dhkdgmleh@naver.com'
                },
                rate: 3,

            }
        ],
        Images:[
            {
                src:"https://img.ssfshop.com/cmd/LB_500x660/src/https://img.ssfshop.com/goods/8SBR/21/09/02/GM0021090283265_0_ORGINL_20210913183415094.jpg"
            },
            {
                src:"https://img.ssfshop.com/cmd/LB_500x660/src/https://img.ssfshop.com/goods/8SBR/21/09/02/GM0021090283265_1_ORGINL_20210913183415094.jpg"
            }
        ],
        Likers: [
            {
                id :2
            },
            {
                id:3
            },
        ],
        Stars : 4,
        Size : size,
        Stock : 10,
        DeliveryFee: 2500,
        notYetReivewers : [{id: 1}, {id: 2}],
    }
    )
    
    
export const dummyProducts  = () =>  (
    {
        id : 1,
        productName: '★인기재입고★ 스카이 블루 퀼팅 경량 리사이클 패딩 점퍼'
        ,
        price : 50000,
        Reviews:[
            {
                id :1,
                content: '이거 좋아요',
                User : {
                    id: 2,
                    email: 'gmlehdhkd@naver.com'
                },
            }
        ],
        Images:[
            {
                src:"https://img.ssfshop.com/cmd/LB_500x660/src/https://img.ssfshop.com/goods/8SBR/21/09/02/GM0021090283265_0_ORGINL_20210913183415094.jpg"
            },
            {
                src:"https://img.ssfshop.com/cmd/LB_500x660/src/https://img.ssfshop.com/goods/8SBR/21/09/02/GM0021090283265_1_ORGINL_20210913183415094.jpg"
            }
        ],
        Likers: [
            {
                id :2
            },
            {
                id:3
            },
        ],
        Stars : 4,
        Size : ['XS','S','M','L'],
        Stock : 10,
        DeliveryFee: 2500,
        notYetReivewers : [{id: 1}, {id: 2}],
            
    }
    )
    export const fakerProducts = (number) => Array(number).fill().map((v,i) =>
        ({
            id : i+1,
        uniqueId : '321938CY2Q',
        productName: faker.name.firstName()
        ,
        price : faker.datatype.number(),
        Reviews:[
            {
                id :1,
                content: '이거 좋아요',
                User : {
                    id: 2,
                    email: faker.internet.email(),
                },
            }
        ],
        Images:[
            {
                src: faker.image.imageUrl(),
            },
            {
                src: faker.image.imageUrl(),
            }
        ],
        Likers: [
            {
                id :2
            },
            {
                id:3
            },
        ],
        Stars : 4,
        Size : 'S',
        Stock : 10,
        deliveryFee: 2500,
        })
        )
const reducer = (state = initialState, action) =>{
    return produce(state,(draft) => {
        switch (action.type) {
            case REGISTER_PRODUCT_REQUEST:
                draft.registerProductLoading = true;
                draft.registerProductDone = false;
                draft.registerProductError = null;
            break;
            case REGISTER_PRODUCT_SUCCESS:
                draft.registerProductLoading = false;
                draft.registerProductDone = true;
                draft.mainProducts.unshift(action.data);
                draft.imagePath = [];
            break;
            case REGISTER_PRODUCT_FAILURE:
                draft.registerProductLoading = false;
                draft.registerProductError = action.error;
            break;

            case UPLOAD_IMAGES_REQUEST:
                draft.uploadImagesLoading = true;
                draft.uploadImagesDone = false;
                draft.uploadImagesError = null;
            break;
            case UPLOAD_IMAGES_SUCCESS:
                draft.uploadImagesLoading = false;
                draft.uploadImagesDone = true;
                draft.imagePath = action.data;
            break;
            case UPLOAD_IMAGES_FAILURE:
                draft.uploadImagesLoading = false;
                draft.uploadImagesError = action.error;
            break;

            case ADD_PRODUCT_REVIEW_REQUEST:
                draft.addProductReviewLoading = true;
                draft.addProductReviewDone = false;
                draft.addProductReviewError = null;
            break;
            case ADD_PRODUCT_REVIEW_SUCCESS:
                draft.addProductReviewLoading = false;
                draft.addProductReviewDone = true;
                draft.singleProduct.Reviews.push(action.data)
                const user = draft.singleProduct.notYetReivewers.find(v => v.id === action.data.User.id)
                draft.singleProduct.notYetReivewers = draft.singleProduct.notYetReivewers.filter(v => v.id !== user.id)
            break;
            case ADD_PRODUCT_REVIEW_FAILURE:
                draft.addProductReviewLoading = false;
                draft.addProductReviewDone = false;
                draft.addProductReviewError = action.error;
            break;

            case LOAD_PRODUCTS_REQUEST:
                draft.loadMainProductsLoading = true;
                draft.loadMainProductsDone = false;
                draft.loadMainProductsError = null;
            break;
            case LOAD_PRODUCTS_SUCCESS:
                draft.loadMainProductsLoading = false;
                draft.loadMainProductsDone = true;
                draft.mainProducts = draft.mainProducts.concat(action.data);
                draft.hasMoreProducts = action.data.length === 10;
            break;
            case LOAD_PRODUCTS_FAILURE:
                draft.loadMainProductsLoading = false;
                draft.loadMainProductsDone = false;
                draft.loadMainProductsError = action.error;
            break;

            case LOAD_PRODUCT_REQUEST:
                draft.loadMainProductsLoading = true;
                draft.loadMainProductsDone = false;
                draft.loadMainProductsError = null;
            break;
            case LOAD_PRODUCT_SUCCESS:
                draft.loadMainProductsLoading = false;
                draft.loadMainProductsDone = true;
                draft.singleProduct = action.data;
            break;
            case LOAD_PRODUCT_FAILURE:
                draft.loadMainProductsLoading = false;
                draft.loadMainProductsDone = false;
                draft.loadMainProductsError = action.error;
            break;
            
            case REMOVE_IMAGE:
                draft.imagePath = draft.imagePath.filter((v,i) => i !== action.data);
                break;
            default:
                break;
        }
    })
}

export default reducer
