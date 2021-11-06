import React, { useCallback, useState } from 'react'
import Link from 'next/link'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Badge, Input, Menu } from 'antd'
import { SearchOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import Search from 'antd/lib/input/Search'
import useInput from '../hooks/useInput'

const Container = styled.div`
        height: 60px;
        background-color: white;

    `
    const Wrapper = styled.div`
        padding: 2px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;

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
    const [searchvalue, onChangeSearch] = useInput('')
    const onSearch = useCallback(
        () => {
            return alert(searchvalue)
        },
        [searchvalue],
    )
    return (
        <>
        <Container>
            <Wrapper>
                <Left>
                    <SearchContainer>
                        <SearchIcon onSearch={onSearch} value={searchvalue} onChange={onChangeSearch} allowClear style={{width: '20rem',}} placeholder="input search text"   />
                    </SearchContainer>
                </Left>
                <Center>
                    <Logo>STAR CLOTHES</Logo>
                </Center>
                <Right>
                    <MenuItem>
                        <Link href="/signup">
                            회원가입
                        </Link>
                    </MenuItem>

                    <MenuItem>
                        <Link href="/signin">
                            로그인
                        </Link>
                    </MenuItem>

                    <MenuItem >
                        <Link href="/signin">
                            <a>
                                <Badge count={5}>
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
