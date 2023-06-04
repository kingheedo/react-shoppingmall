import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/configureStore";

/** 일반 dispatch를 이용할 경우 타입을 일일이 넣어주어야 해서 별도 hook으로 빼놓음 */
   export const useAppDispatch: () => AppDispatch = useDispatch;

   export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;