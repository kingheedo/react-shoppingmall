'use client';

import { PropsWithChildren, createContext, useContext, useEffect, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { GetUserRes } from '../apis/user/schema';
import { useRecoilState } from 'recoil';
import { LoginState } from '../store';
import useGetUser from '../hooks/queries/useGetUser';

const noAccessPathList = ['/cart', '/mypage', '/order'];
const AuthContext = createContext<GetUserRes | null>(null);

const AuthProvider = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const pathname = usePathname();

  const [getLoginState, setLoginState] = useRecoilState(LoginState);
  const { user } = useGetUser({
    onErrorCb: () => setLoginState(null),
    onSuccessCb: () => {
      if (user) {
        if (user.info) {
          setLoginState({
            id: user.info.id
          });
        }
      } else {
        setLoginState(null);
      }
    }
  });

  const userInfo = useMemo(() => {
    return user || null;
  }, [user]);

  useEffect(() => {
    if (!getLoginState) {
      if (noAccessPathList.indexOf(pathname) !== -1) {
        router.push('/signIn');
      }
    } else {
      if (pathname === '/signUp' || pathname === '/signIn') {
        router.push('/');
      }
    }
  }, [pathname, getLoginState]);

  console.log('userInfo', userInfo);

  return (
    <AuthContext.Provider value={userInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export const getUser = () => useContext(AuthContext);

export default AuthProvider;