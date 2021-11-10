import faker from 'faker'
import produce from 'immer'
export const initialState = {
    mainProducts: [],
    singleProduct: null,
    loadMainProductsLoading : false,
    loadMainProductsDone : false,
    loadMainProductsError : null,

}



export const LOAD_PRODUCT_REQUEST = 'LOAD_PRODUCT_REQUEST';
export const LOAD_PRODUCT_SUCCESS = 'LOAD_PRODUCT_SUCCESS';
export const LOAD_PRODUCT_FAILURE = 'LOAD_PRODUCT_FAILURE';

export const LOAD_PRODUCTS_REQUEST = 'LOAD_PRODUCTS_REQUEST';
export const LOAD_PRODUCTS_SUCCESS = 'LOAD_PRODUCTS_SUCCESS';
export const LOAD_PRODUCTS_FAILURE = 'LOAD_PRODUCTS_FAILURE';

export const dummyProduct  = () =>  (
    {
        id : 1,
        uniqueId : '321938CY2Q',
        name: '★인기재입고★ 스카이 블루 퀼팅 경량 리사이클 패딩 점퍼'
        ,
        inStock : true,
        price : 50000,
        Reviews:[
            {
                id :1,
                content: '이거 좋아요',
                User : {
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
        Color : ['blue','beige','white','black'],
        Size : 'S',
        Stock : 10,
            
    }
    )

export const dummyProducts  = () =>  (
    {
        id : 1,
        uniqueId : '321938CY2Q',
        name: '★인기재입고★ 스카이 블루 퀼팅 경량 리사이클 패딩 점퍼'
        ,
        inStock : true,
        price : 50000,
        Reviews:[
            {
                id :1,
                content: '이거 좋아요',
                User : {
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
        Color : ['blue','beige','white','black'],
        Size : 'S',
        Stock : 10,
            
    }
    )

const reducer = (state = initialState, action) =>{
    return produce(state,(draft) => {
        switch (action.type) {
            case LOAD_PRODUCTS_REQUEST:
                draft.loadMainProductsLoading = true;
                draft.loadMainProductsDone = false;
                draft.loadMainProductsError = null;
            break;
            case LOAD_PRODUCTS_SUCCESS:
                draft.loadMainProductsLoading = false;
                draft.loadMainProductsDone = true;
                draft.mainProducts.push(action.data);
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
