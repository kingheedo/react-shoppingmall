import { useQuery } from '@tanstack/react-query';
import { PropsWithChildren, createContext, useContext, useEffect, useMemo } from 'react';
import apis from '../apis';
import { useRouter } from 'next/router';
import { GetUserRes } from '../apis/user/schema';
import { useRecoilValue } from 'recoil';
import { LoginState } from '../store';

const noAccessPathList = ['/cart', '/mypage', '/order'];
const AuthContext = createContext<GetUserRes | null>(null);

const AuthProvider = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const getLoginState = useRecoilValue(LoginState);
  const { data: getUserData } = useQuery(
    ['getUser',router.pathname], 
    () => apis.User.getUser());
  
  const userInfo = useMemo(() => {
    return getUserData || null;
  }, [getUserData]);
  
  useEffect(() => {
    if (!getLoginState) {
      if (noAccessPathList.indexOf(router.pathname) !== -1) {
        router.push('/signin');
      }
    }
  }, [router.pathname,getLoginState]);
  
  console.log('userInfo',userInfo);

  return (
    <AuthContext.Provider value={userInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export const getUser = () => useContext(AuthContext);

export default AuthProvider;