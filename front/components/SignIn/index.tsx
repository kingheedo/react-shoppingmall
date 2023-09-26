import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { PostLoginReq } from '../../apis/user/schema';
import apis from '../../apis';
import Router from 'next/router';
import Link from 'next/link';

const SignInArea = styled.div`
max-width: 1440px;
    min-width: 1280px;
    width: auto;
    min-height: calc(100vh - 586px);
    margin: 0 auto;
    padding: 80px var(--gap) 120px;
`;

const Content = styled.div`
    width: 520px;
    margin: 0 auto;
}
`;

const Title = styled.h1`
    margin-bottom: 100px;
    font-size: var(--fontI);
    line-height: var(--fontIL);
    color: var(--gray900);
    text-align: center;
`;

const Form = styled.form`
  display: flex;
`;

const InputArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;

  > label {
    &:not(:first-of-type){
      margin-top: 10px;
    }
      > input {
      height: 50px;
      line-height: 48px;
      padding: 0 20px;
      border: 1px solid #e5e5e5;
      width: 100%;
    }
  }
  .password-wrap {
    position: relative;
      >input[type=text]{
        + i{
          background: url(/bg_base.png) no-repeat #fff center -450px;
        }
      }
        > i {
          position: absolute;
          top: 50%;
          right: 5px;
          transform: translateY(-50%);
          display: inline-block;
          width: 22px;
          height: 28px;
          background: url(/bg_base.png) no-repeat #fff center -400px;
          cursor: pointer;
        }
      }
`;

const LoginBtn = styled.button`
  width: 138px;
  padding: 0 10px;
  margin-left: 20px;
  background: #111;
  color: #fff;
  font-size: 17px;
  line-height: 22px;
  text-align: center;
`;

const LinkWrap = styled.div`
    display: flex;
    justify-content: space-around;
    padding: 20px 50px;
    margin-top: 40px;
    background: #f7f7f7;

    > a{
      line-height: 35px;
    }
`;

const SnsWrap = styled.dl`
    text-align: center;
    padding-top: 55px;
    > dt {
      position: relative;
      text-align: center;

      > span{
        position: relative;
        display: inline-block;
        padding: 0 19px;
        line-height: 28px;
        font-size: 19px;
        background: #fff;
      }

      &::before{
        position: absolute;
        top: 50%;
        left: 0;
        display: inline-block;
        width: 100%;
        height: 1px;
        background: #e5e5e5;
        content: '';      
      }
      
    }

    > dd{
      display: flex;
      justify-content: space-around;
      padding: 35px 60px 40px;
      
      > a{
        display: inline-block;
        margin: 0 10px;
        padding-left: 42px;
        height: 32px;
        line-height: 32px;
        color: #444;
        background: url(/bg_sns.jpg) no-repeat;
        font-size: 13px;
        font-weight: 700;
      }

      .kakao-link{
        background-position: 0 0;
      }
      .naver-link{
        background-position: 0 -64px;
      }
    }
`;

type User = {
  email: string;
  password: string;
}

const SignIn = () => {
  const [user, setUser] = useState<User>({
    email: '',
    password: ''
  });
  const passwordRef = useRef<HTMLInputElement | null>(null);

  const queryClient = useQueryClient();
  const { mutate: postLogin } = useMutation(async(data:PostLoginReq) => await apis.User.logIn(data),{
    onSuccess: () => {
      queryClient.invalidateQueries(['getUser']).then(() => Router.back());

    },
    onError: () => {
      alert('로그인 오류');
    }
  });
 
  /** 이메일 패스워드 핸들러 */
  const onChangeUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.id === 'email') {
      setUser({
        ...user,
        email: e.target.value
      });
    } else if (e.target.id === 'password') {
      setUser({
        ...user,
        password: e.target.value
      });
    }
  };
  
  /** 로그인 버튼 클릭 시 */
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    postLogin(user);
  };

  /** 패스워드 show hide 핸들러 */
  const onClickPwdEye = () => {
    if (passwordRef.current) {
      const type = passwordRef.current.type;
      passwordRef.current.type = type === 'password' ? 'text' : 'password';
    }
  };

  return (
    <SignInArea>
      <Content className="content">
        <Title>로그인</Title>
        <Title />
        <Form onSubmit={onSubmit}>
          <InputArea>
            <label>
              <input 
                id="email"
                value={user.email}
                onChange={onChangeUser}
                type="text" 
                placeholder="이메일" 
                required
              />
            </label>
            <label className="password-wrap">
              <input 
                ref={passwordRef}
                id="password"
                value={user.password}
                onChange={onChangeUser}
                type="password" 
                placeholder="비밀번호" 
                required
              />
              <i onClick={onClickPwdEye} className="eye-icon"/>
            </label>
          </InputArea>
          <LoginBtn>
            로그인
          </LoginBtn>
        </Form>
        <LinkWrap>
          <Link href={'/signin'}>
            아이디 찾기
          </Link>
          <Link href={'/signin'}>
            비밀번호 찾기
          </Link>
          <Link href={'/signup'}>
            회원가입
          </Link>
        </LinkWrap>
        <SnsWrap>
          <dt>
            <span>
              SNS 계정으로 로그인
            </span>
          </dt>
          <dd>
            <a className="kakao-link" href="http://localhost:3065/auth/kakao">
              카카오 로그인
            </a>
            <a className="naver-link" href="http://localhost:3065/auth/naver">
              네이버 로그인
            </a>
          </dd>
        </SnsWrap>
      </Content>
    </SignInArea>
  );
};

export default SignIn;