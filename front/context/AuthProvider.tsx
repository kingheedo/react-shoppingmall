'use client';

import { useQuery } from '@tanstack/react-query';
import { PropsWithChildren, createContext, useContext, useEffect, useMemo } from 'react';
import apis from '../apis';
import { usePathname, useRouter } from 'next/navigation';
import { GetUserRes } from '../apis/user/schema';
import { useRecoilState, useRecoilValue } from 'recoil';
import { LoginState } from '../store';

const noAccessPathList = ['/cart', '/mypage', '/order'];
const AuthContext = createContext<GetUserRes | null>(null);

const AuthProvider = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const pathname = usePathname();
  
  const [getLoginState, setLoginState] = useRecoilState(LoginState);
  const { data: getUserData } = useQuery({
    queryKey: ['getUser',pathname], 
    queryFn: () => apis.User.getUser(),
    onError: () => setLoginState(null),
    onSuccess: (data) => {
      console.log('data',data);
      if (data) {
        if (data.info) {
          setLoginState({
            id: data.info.id
          });
        }
      } else {
        setLoginState(null);
      }
    }
  });
  
  const userInfo = useMemo(() => {
    return getUserData || null;
  }, [getUserData]);
  
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