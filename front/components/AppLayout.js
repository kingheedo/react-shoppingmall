import React, { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import PropTypes from 'prop-types'
import { Badge, Button} from 'antd'
import { ShoppingCartOutlined } from '@ant-design/icons'
import Search from 'antd/lib/input/Search'
import useInput from '../hooks/useInput'
import styled, {createGlobalStyle} from 'styled-components';
import { useDispatch, useSelector } from 'react-redux'
import { LOG_IN_REQUEST, LOG_OUT_REQUEST } from '../reducers/user'
import  Router  from 'next/router'



export const Global = createGlobalStyle`
    a{
        color: #111111;
    } 
    a:hover{
        color: #111111;
    }
    
 `;


const Container = styled.div`
        height: 60px;
        background-color: white;
        @media only screen and (max-width: 870px) {
        height: 120px; 
        @media only screen and (max-width: 770px) {
        margin-bottom: 2rem;
        }
        }
    `
    const Wrapper = styled.div`
        padding: 2px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        @media only screen and (max-width: 770px) {
        flex-direction : column;
        }

    `
    const Left = styled.div`
        flex:1;

    `
    const SearchContainer = styled.div`
        display: flex;
        align-items: center;
        padding: 5px;

    `
    const Right = styled.div`
        flex:1;
        display:flex;
        align-item: center;
        justify-content: flex-end;

    `
    const Center = styled.div`
        flex:1;
        text-align: center;

    `
    const Logo = styled.h1`
        font-weight : bold;
        line-height : 1.8;

    `
    const MenuItem = styled.div`
        font-size: 14px;
        margin-left: 25px;

    `
    const SearchIcon =styled(Search)`
        .ant-input-search-button {
            height: 29px;

        }
    `
const AppLayout = ({children}) => {
    const {me,} = useSelector(state => state.user)
    const {products} = useSelector(state => state.cart)
    const [searchvalue, onChangeSearch] = useInput('')
    const dispatch = useDispatch();

   
    const onSearch = useCallback(
        () => {
            return alert(searchvalue)
        },
        [searchvalue],
    )
        

        const onHandleLogout = useCallback(
            () => {
                dispatch({
                    type: LOG_OUT_REQUEST
                })
            },
            [],
        )
        
    return (
        <>
        <Container>
        <Global />
            <Wrapper>
                <Left>
                    <SearchContainer>
                        <SearchIcon onSearch={onSearch} value={searchvalue} onChange={onChangeSearch} allowClear style={{width: '20rem',}} placeholder="input search text"   />
                    </SearchContainer>
                </Left>
                <Center>
                    <Logo>
                        <Link href="/">
                        <a>STAR CLOTHES</a>
                        </Link>
                    </Logo>
                </Center>
                <Right>
                    {me
                     ? 
                     (<MenuItem>
                        <Button>
                            <Link href='/productForm'>
                            <a>상품등록</a>
                            </Link>
                        </Button>
                    </MenuItem>)
                     : null
                     
                    }
                    {me
                     ? null
                     :
                     (<MenuItem>
                        <Button>
                            <Link href='/signup'>
                            <a>회원가입</a>
                            </Link>
                        </Button>
                    </MenuItem>)
                    }

                    <MenuItem>
                        {me 
                        ?
                        <Button onClick={onHandleLogout}>
                            로그아웃
                        </Button>
                        :
                        <Button>
                            <Link href="/signin">
                                <a>로그인</a>
                            </Link>
                        </Button>
                        }
                    </MenuItem>

                    <MenuItem >
                        <Link href="/cart">
                            <a>
                                <Badge count={products.length}>
                                    <ShoppingCartOutlined style ={{fontSize: '28px'}} />
                                </Badge>
                            </a>
                        </Link>
                    </MenuItem>
                </Right>
            </Wrapper>
        </Container>
        {children}
        </>
    )
}

AppLayout.propTypes={
    children: PropTypes.node.isRequired
}

export default AppLayout
