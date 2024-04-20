'use client';
import { useMutation } from '@tanstack/react-query';
import React, { useMemo, useRef } from 'react';
import apis from '../../../apis';
import styled from 'styled-components';
import { useInput } from '../../../hooks/useInput';
import { useRouter } from 'next/navigation';

const Main = styled.div`
  min-width: 1280px;
  max-width: 1440px;
  padding: 80px var(--gap) 120px;
  margin: 0 auto;
`;
const Title = styled.h1`
  margin-bottom: 40px;
  font-size: var(--fontI);
  line-height: var(--fontIL);
  color: var(--gray900);
  text-align: center;
`;
const Section = styled.section`
  width: 520px;
  margin: 0 auto;
`;

const InputRow = styled.div`
    position: relative;
    margin-top: 30px;
    padding-left: 102px;
    
    label {
      position: absolute;
      left: 0;
      top: 9px;
      line-height: 22px;
      font-size: 15px;
      &::after{
        position: absolute;
        top: 4px;
        margin: 0 0 0 4px;
        content: '';
        display: inline-block;
        width: 5px;
        height: 5px;
        background: #8e1fff;
        border-radius: 50%;
      }
  }
  input{
      width: 100%;          
      height: 40px;
      line-height: 38px;
      padding: 0 20px;
      box-sizing: border-box;
      border: 1px solid #e5e5e5;
       + .eye-icon{
          position: absolute;
          top: 50%;
          right: 5px;
          transform: translateY(-50%);
          display: inline-block;
          width: 22px;
          height: 28px;
          cursor: pointer;
       }
      &[type=password]{
        + .eye-icon {
          background: url(/bg_base.png) no-repeat #fff center -400px;
        }
      }
      &[type=text]{
        + .eye-icon {
          background: url(/bg_base.png) no-repeat #fff center -450px;
        }
      }
    }
    .invalid-text{
      margin-top: 5px;
      color: #f0394d;
    }
`;
interface IInputWrapProps {
  valid: boolean
}

const InputWrap = styled.div<IInputWrapProps>`
    position: relative;
    input{
      border: ${(props) => !props.valid && '1px solid #f0394d'}
    }
`;

const Submit = styled.div`
    margin-top: 50px;
    text-align: center;
    > button{
      color: #fff;
      background: #111;
      border: 1px solid #111;
      width: 256px;
      height: 60px;
      line-height: 58px;
      font-size: 17px;
      padding: 0 69px;
    }    
`;

const SignUp = () => {
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const passwordCheckRef = useRef<HTMLInputElement | null>(null);
  const { value: email, handler: handleEmail } = useInput({ initialValue: '' });
  const { value: password, handler: handlePassword } = useInput({ initialValue: '' });
  const { value: passwordCheck, handler: handlePasswordCheck } = useInput({ initialValue: '' });
  const { value: name, handler: handleName } = useInput({ initialValue: '' });
  // const { value: phone, handler: handlePhone } = useInput({ initialValue: '', regex: /[^0-9]/g });
  const router = useRouter();
  const { mutate: postSignUp } = useMutation({
    mutationFn: () => apis.User.signUp({ email, name, password }),
    onSuccess: () => {
      alert('회원가입이 완료되었습니다.');
      router.push('/signIn');
    },
    onError: () => {
      alert('회원가입 오류가 발생하였습니다.');
    }
  });
  /** 비밀번호와 비밀번호 확인란이 일치하는 지 여부 리턴 */
  const isCorrectPassword = useMemo(() => {
    if (password.length > 0 && passwordCheck.length > 0) {
      return password === passwordCheck;
    } else {
      return true;
    }

  }, [password, passwordCheck]);

  /** 폼 제출 시 */
  const onSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('isCorrectPassword', isCorrectPassword);

    if (isCorrectPassword) {
      postSignUp();
    }
  };

  /** 패스워드 눈 모양 클릭 시
   * 
   * 1. input type이 password이면 text로 text이면 password로 변경 
   */
  const onClickEye = (payloadRef: React.MutableRefObject<HTMLInputElement | null>) => {
    if (payloadRef.current) {
      payloadRef.current.type = payloadRef.current.type === 'password' ? 'text' : 'password';
    }
  };

  return (
    <Main>
      <Title>회원가입</Title>
      <Section className="form-wrap">
        <form onSubmit={onSubmitForm}>
          <InputRow>
            <label htmlFor="email">
              이메일
            </label>
            <input
              id="email"
              type="email"
              maxLength={30}
              value={email}
              onChange={handleEmail}
            />
          </InputRow>
          <InputRow>
            <label htmlFor="password">
              비밀번호
            </label>
            <input
              ref={passwordRef}
              id="password"
              type="password"
              maxLength={100}
              value={password}
              onChange={handlePassword}
            />
            <i onClick={() => onClickEye(passwordRef)} className="eye-icon" />

          </InputRow>
          <InputRow>
            <label htmlFor="password-check">
              비밀번호 확인
            </label>
            <InputWrap valid={isCorrectPassword}>
              <input
                ref={passwordCheckRef}
                id="password-check"
                type="password"
                maxLength={30}
                value={passwordCheck}
                onChange={handlePasswordCheck}
              />
              <i onClick={() => onClickEye(passwordCheckRef)} className="eye-icon" />
            </InputWrap>
            {!isCorrectPassword && <p className="invalid-text">비밀번호를 다시 확인해주세요.</p>}
          </InputRow>
          <InputRow>
            <label htmlFor="name">
              이름
            </label>
            <input
              id="name"
              type="text"
              maxLength={30}
              value={name}
              onChange={handleName}
            />
          </InputRow>
          {/* <InputRow>
          <label htmlFor="phone">
            휴대폰 번호
          </label>
          <input
            id="phone" 
            type="tel"
            maxLength={11}
            value={phone}
            onChange={(e) => handlePhone(e)}
          />
        </InputRow> */}
          <Submit>
            <button type="submit">
              가입하기
            </button>
          </Submit>

        </form>
      </Section>
    </Main>
  );
};

export default SignUp;