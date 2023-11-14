import { useQuery } from '@tanstack/react-query';
import { PropsWithChildren, createContext, useContext, useMemo } from 'react';
import apis from '../apis';
import { useRouter } from 'next/router';
import { GetUserRes } from '../apis/user/schema';

const LoginContext = createContext<GetUserRes | null>(null);

const LoginProvider = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const { data: getUserData } = useQuery(
    ['getUser', router.pathname], 
    () => apis.User.getUser());
  
  const userInfo = useMemo(() => {
    return getUserData || null;
  }, [getUserData]);
    
  console.log('userInfo',userInfo);

  return (
    <LoginContext.Provider value={userInfo}>
      {children}
    </LoginContext.Provider>
  );
};

export const getUser = () => useContext(LoginContext);

export default LoginProvider;