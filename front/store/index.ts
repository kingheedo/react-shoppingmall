import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

interface ILoginState {
  id: number;
}

const localStorage = typeof window !== 'undefined' ? window.localStorage : undefined;

const { persistAtom } = recoilPersist({
  key: 'userInfo', // this key is using to store data in local storage
  storage: localStorage // configurate which stroage will be used to store the data
});

export const LoginState = atom<ILoginState | null>({
  key: 'LoginState',
  default: null,
  effects_UNSTABLE: [persistAtom]
});