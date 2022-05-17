import { HYDRATE } from 'next-redux-wrapper';
import { AnyAction } from 'redux';
import { combineReducers } from '@reduxjs/toolkit';
import cart from './cart';
import user from './user';
import product from './product';

const reducer = (state:any, action:AnyAction) => {
    if (action.type === HYDRATE) {
        return {
            ...state,
            ...action.payload,
        };
    }
    return combineReducers({
        user,
        cart,
        product,
    })(state, action);
};

export default reducer;
