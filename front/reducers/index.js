import { HYDRATE } from 'next-redux-wrapper';
import { combineReducers } from 'redux';
import user from './user';
import product from './product';
import cart from './cart';

const rootReducer = (state, action) => {
        switch (action.type) {
            case HYDRATE:
                console.log('HYDRATE', action);
                return action.payload;
            default: {
                const combineReducer = combineReducers({
                    user,
                    product,
                    cart,
                });
                return combineReducer(state, action);
            }
        }
};

export default rootReducer;