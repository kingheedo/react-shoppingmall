import { HYDRATE } from 'next-redux-wrapper';
import { AnyAction } from 'redux';
import { combineReducers } from '@reduxjs/toolkit';
import cart from './cart';
import user from './user';
import product from './product';

const reducer = (state:any, action:AnyAction) => {
  switch (action.type) {
    case HYDRATE:
      return action.payload;
    default: {
      const combinedReducer = combineReducers({
        user,
        product,
        cart,
      });
      return combinedReducer(state, action);
    }
  }
};

export default reducer;
