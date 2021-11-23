import faker from 'faker'
import produce from 'immer'
export const initialState = {
    mainProducts: [],
    singleProduct: null,
    loadMainProductsLoading : false,
    loadMainProductsDone : false,
    loadMainProductsError : null,
    addProductReviewLoading: false,
    addProductReviewDone: false,
    addProductReviewError: false,

}





export const ADD_PRODUCT_REVIEW_REQUEST = 'ADD_PRODUCT_REVIEW_REQUEST';
export const ADD_PRODUCT_REVIEW_SUCCESS = 'ADD_PRODUCT_REVIEW_SUCCESS';
export const ADD_PRODUCT_REVIEW_FAILURE = 'ADD_PRODUCT_REVIEW_FAILURE';

export const LOAD_PRODUCT_REQUEST = 'LOAD_PRODUCT_REQUEST';
export const LOAD_PRODUCT_SUCCESS = 'LOAD_PRODUCT_SUCCESS';
export const LOAD_PRODUCT_FAILURE = 'LOAD_PRODUCT_FAILURE';

export const LOAD_PRODUCTS_REQUEST = 'LOAD_PRODUCTS_REQUEST';
export const LOAD_PRODUCTS_SUCCESS = 'LOAD_PRODUCTS_SUCCESS';
export const LOAD_PRODUCTS_FAILURE = 'LOAD_PRODUCTS_FAILURE';

export const dummyProduct  = (productId, size, quantity, productPrice) =>  (
    {
        id : productId,
        quantity : quantity,
        uniqueId : '321938CY2Q',
        name: '★인기재입고★ 스카이 블루 퀼팅 경량 리사이클 패딩 점퍼'
        ,
        price : 100,
        pluralPrice : productPrice,
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
        Colors : ['blue','beige','white','black'],
        Size : size,
        Stock : 10,
        DeliveryFee: 2500,
        notYetReivewers : [{id: 1}, {id: 2}],
    }
    )
    
    
export const dummyProducts  = () =>  (
    {
        id : 1,
        uniqueId : '321938CY2Q',
        name: '★인기재입고★ 스카이 블루 퀼팅 경량 리사이클 패딩 점퍼'
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
        Size : 'S',
        Stock : 10,
        DeliveryFee: 2500,
        notYetReivewers : [{id: 1}, {id: 2}],
            
    }
    )
    export const fakerProducts = () => Array(30).fill().map((v,i) =>
        ({
            id : i+1,
        uniqueId : '321938CY2Q',
        name: faker.name.firstName()
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
                draft.mainProducts = [];
            break;
            case LOAD_PRODUCTS_SUCCESS:
                draft.loadMainProductsLoading = false;
                draft.loadMainProductsDone = true;
                draft.mainProducts = action.data;
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
        
            default:
                break;
        }
    })
}

export default reducer
