import React, { useCallback, useEffect, } from 'react'
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import Link from 'next/link';
import Router from 'next/router';
import useInput from '../hooks/useInput';
import { useDispatch, useSelector } from 'react-redux';
import { LOG_IN_REQUEST } from '../reducers/user';

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
                
`
const Wrapper = styled.div`
    width: 20%;
    padding: 20px;
    background-color: white;
`
const SignUpButton = styled(Button)`
 float: right;
`
const Signin = () => {
    const [email, onChangeEmail] = useInput('')
    const [password, onChangePassword] = useInput('')
    const {me,loginDone,loginError} = useSelector(state => state.user)
    
    const dispatch = useDispatch();

    useEffect(() => {
        if(loginError){
           alert(loginError)
        }
    }, [loginError])

    useEffect(() => {
        if(me){
            Router.back()
        }
    }, [me])

    const onhandleSubmit = useCallback(
    (e) => {
        e.preventDefault();
        dispatch({
            type : LOG_IN_REQUEST,
            data : {email, password}
        })
    },
    [email,password],
)
    const onhandleSignUp = useCallback(
    () => {
        Router.push('/signup')
    },
    [],
)

    return (
        <Container>
            <Wrapper>
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onhandleSubmit}
                    >
                        <h1>LOGIN</h1>
                    <Form.Item
                        name="E-mail"
                        rules={[
                        {
                            required: true,
                            message: '이메일을 입력해주세요!',
                        },
                        ]}
                    >
                        <Input value={email} onChange={onChangeEmail} prefix={<UserOutlined className="site-form-item-icon" />} placeholder="E-mail" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                        {
                            required: true,
                            message: '비밀번호를 입력해주세요!',
                        },
                        ]}
                    >
                        <Input
                        value={password}
                        onChange={onChangePassword}
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="Password"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button onClick={onhandleSubmit} type="primary" htmlType="submit" className="login-form-button">
                        로그인
                        </Button>
                        <SignUpButton onClick={onhandleSignUp} type="primary" htmlType="submit" className="signup-form-button">
                            회원가입
                        </SignUpButton>
                    </Form.Item>
                    </Form>
            </Wrapper>
        </Container>
    )
}

export default Signin
