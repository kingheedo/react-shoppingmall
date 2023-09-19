import React, { FC, useCallback, useEffect } from 'react';
import {
  Form, Input, Button,
} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import Router from 'next/router';
import useInput from '../hooks/useInput';
import { getUser } from '../context/LoginProvider';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apis from '../apis';
import { PostLoginReq } from '../apis/user/schema';
import SignIn from '../components/SignIn';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items:center;
  justify-content: center;
  background: linear-gradient(
    rgba(255,255,255,0.3),
    rgba(255,255,255,0.3)
  ), url("http://app-storage-edge-003.cafe24.com/bannermanage2/insilence1/2021/11/04/59b551c37c5dcbf7548f4bc8b3386b1d.jpg");
  background-size: cover;
                
`;
const Wrapper = styled.div`
    background-color: white;
`;
const SignUpButton = styled(Button)`
 float: right;
`;
const FormDiv = styled.div`
    width: 400px;
    padding: 20px;
`;
const SignInPage: FC = () => {
  const [email, onChangeEmail] = useInput('');
  const [password, onChangePassword] = useInput('');
  const me = getUser();
  const queryClient = useQueryClient();

  const { mutate: postLogin } = useMutation(async(data:PostLoginReq) => await apis.User.logIn(data),{
    onSuccess: () => {
      queryClient.invalidateQueries(['getUser']).then(() => Router.back());

    },
    onError: () => {
      alert('로그인 오류');
    }
  });

  // useEffect(() => {
  //   if (me?.id) {
  //     Router.back();
  //   }
  // }, [me]);

  const onClickLogin = () => {
    postLogin({
      email,
      password
    });
      
  };

  const onhandleSignUp = useCallback(
    () => {
      Router.push('/signup');
    },
    [],
  );

  return (
    <SignIn/>
  );
};

export default SignInPage;
