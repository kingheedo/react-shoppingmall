import { HYDRATE } from 'next-redux-wrapper';
import { AnyAction, combineReducers } from 'redux';
import user from './user';
import product from './product';
import cart from './cart';

const rootReducer = (state:any, action:AnyAction) => {
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
export type RootState = ReturnType<typeof rootReducer>
export default rootReducer;
