import React, { useCallback, useState } from 'react'
import {Form, Input, Checkbox, Button} from 'antd'
const Signup = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmpassword, setConfirmPassword] = useState('')
    const [nickname, setNickname] = useState('')

    const onChangeEmail = useCallback(
        (e) => {
            setEmail(e.target.value)
        },
        [],
    )
    return (
            <div style={{width: '100vw', height: '100vh',display: 'flex', alignItems:'center', justifyContent: 'center'}}>

                <Form>
                    <Form.Item
                        name="email"
                        label="E-mail"
                        rules={[
                        {
                            type: 'email',
                            message: 'The input is not valid E-mail!',
                        },
                        {
                            required: true,
                            message: 'Please input your E-mail!',
                        },
                        ]}
                    >
                        <Input value={email} onChange={onChangeEmail} />
                    </Form.Item>

                    <Form.Item
                name="password"
                label="Password"
                rules={[
                {
                    required: true,
                    message: 'Please input your password!',
                },
                ]}
                hasFeedback
            >
                <Input.Password value={{password}} />
            </Form.Item>

            <Form.Item
                name="confirm"
                label="Confirm Password"
                dependencies={['password']}
                hasFeedback
                rules={[
                {
                    required: true,
                    message: 'Please confirm your password!',
                },
                
                ]}
            >
                <Input.Password value={{confirmpassword}} />
            </Form.Item>

                    <Form.Item
                        name="nickname"
                        label="Nickname"
                        tooltip="What do you want others to call you?"
                        rules={[{ required: true, message: 'Please input your nickname!', whitespace: true }]}
                    >
                        <Input value={nickname} />
                    </Form.Item>

                    <Form.Item
                        valuePropName="checked"
                    >
                        <Checkbox>
                        I have read the <a href="">agreement</a>
                        </Checkbox>
                    </Form.Item>
                    <Form.Item >
                        <Button type="primary" htmlType="submit">
                        Register
                        </Button>
                    </Form.Item>
            </Form>
            </div>
    )
}

export default Signup
