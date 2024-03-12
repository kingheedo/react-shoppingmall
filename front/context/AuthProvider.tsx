'use client';

import { useQuery } from '@tanstack/react-query';
import { PropsWithChildren, createContext, useContext, useEffect, useMemo } from 'react';
import apis from '../apis';
import { usePathname, useRouter } from 'next/navigation';
import { GetUserRes } from '../apis/user/schema';
import { useRecoilValue } from 'recoil';
import { LoginState } from '../store';

const noAccessPathList = ['/cart', '/mypage', '/order'];
const AuthContext = createContext<GetUserRes | null>(null);

const AuthProvider = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const pathname = usePathname();
  
  const getLoginState = useRecoilValue(LoginState);
  const { data: getUserData } = useQuery(
    ['getUser',pathname], 
    () => apis.User.getUser());
  
  const userInfo = useMemo(() => {
    return getUserData || null;
  }, [getUserData]);
  
  useEffect(() => {
    if (!getLoginState) {
      if (noAccessPathList.indexOf(pathname) !== -1) {
        router.push('/signIn');
      }
    }
  }, [pathname,getLoginState]);
  
  console.log('userInfo',userInfo);

  return (
    <AuthContext.Provider value={userInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export const getUser = () => useContext(AuthContext);

export default AuthProvider;