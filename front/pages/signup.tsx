import React, { useCallback, useEffect, useState } from 'react';
import {
  Form, Input, Checkbox, Button,
} from 'antd';
import Router from 'next/router';
import styled from 'styled-components';

import useInput from '../hooks/useInput';
import { useMutation } from '@tanstack/react-query';
import apis from '../apis';
import { PostSignUpRes } from '../apis/user/schema';

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
const FormDiv = styled.div`
    width: 400px;
    padding: 20px;
`;
const Signup = () => {
  const [email, onChangeEmail] = useInput('');
  const [password, onChangePassword] = useInput('');
  const [confirmpassword, onChangeConfirmpassword] = useInput('');
  const [name, onChangeName] = useInput('');
  const [checkpassword, setCheckPassword] = useState(false);
  const [check, setCheck] = useState(false);
  const [checkerror, setCheckError] = useState(false);

  const { mutate: postSignUp } = useMutation({
    mutationFn: () => apis.User.signUp({ email, name, password }),
    onSuccess: (data) => alert(data)
  });
  // useEffect(() => {
  //   if (signUpDone) {
  //     dispatch(
  //       logIn({ email, password }),
  //     );
  //     dispatch(signUpReset());
  //     alert('회원가입이 완료되었습니다.');
  //     Router.push('/');
  //   }
  // }, [signUpDone]);
  // useEffect(() => {
  //   if (signUpError) {
  //     alert(signUpError);
  //   }
  // }, [signUpError]);

  useEffect(() => {
    if (password && confirmpassword && password !== confirmpassword) {
      return setCheckPassword(true);
    }
    setCheckPassword(false);
  }, [password, confirmpassword]);

  const onChangeCheck = useCallback(
    () => {
      setCheck((prev) => !prev);
    },
    [],
  );

  const onSubmitForm = useCallback(
    () => {
      if (checkpassword) {
        return alert('비밀번호를 확인해주세요');
      }
      if (!check) {
        return setCheckError(true);
      }
      if (!(email && password && name && confirmpassword && check)) {
        return alert('빈칸이 존재합니다.');
      }
      postSignUp();
      // dispatch(signUp({ email, name, password }));
    },
    [email, password, name, confirmpassword, check, checkpassword],
  );
  
  return (
    <Container>
      <Wrapper>
        <FormDiv>
          <Form onFinish={onSubmitForm}>
            <h1>CREATE AN ACCOUNT</h1>
            <Form.Item
              name="email"
              label="이메일"
              rules={[
                {
                  type: 'email',
                  message: '이메일 형식이 아닙니다.',
                },
                {
                  required: true,
                  message: '이메일을 입력해 주세요.',
                },
              ]}
            >
              <Input placeholder="이메일" value={email} onChange={onChangeEmail} />
            </Form.Item>
            <Form.Item
              name="name"
              label="이름"
              rules={[
                {
                  required: true,
                  message: '이름을 입력해주세요.',
                  whitespace: true,
                },
              ]}
            >
              <Input placeholder="이름" value={name} onChange={onChangeName} />
            </Form.Item>
            <Form.Item
              style={{ marginRight: '10px' }}
              name="password"
              label="비밀번호"
              rules={[
                {
                  required: true,
                  message: '비밀번호를 입력해주세요.',
                },
              ]}
            >
              <Input.Password placeholder="비밀번호" value={password} onChange={onChangePassword} />
            </Form.Item>

            <Form.Item
              name="confirm"
              label="비밀번호 확인"
              rules={[
                {
                  required: true,
                  message: '입력하신 비밀번호가 다릅니다.',
                },
              ]}
            >
              <Input.Password placeholder="비밀번호 확인" value={confirmpassword} onChange={onChangeConfirmpassword} />

            </Form.Item>

            <Form.Item
              name="agreement"
              valuePropName="checked"
            >
              <Checkbox checked={check} onChange={onChangeCheck}>
                I have read the
                {' '}
                <a href="">agreement</a>
              </Checkbox>
              {checkerror && <div>약관에 동의하세요!</div>}
            </Form.Item>

            <Form.Item>
              <Button onClick={(e) => onSubmitForm} type="primary" htmlType="submit">
                    CREATE
              </Button>
              {/* {signUpLoading ? (
                <Button type="primary" loading>
                  Loading
                </Button>
              )
                : (
                  <Button onClick={(e) => onSubmitForm} type="primary" htmlType="submit">
                    CREATE
                  </Button>
                )} */}
            </Form.Item>
          </Form>
        </FormDiv>
      </Wrapper>

    </Container>
  );
};

export default Signup;
