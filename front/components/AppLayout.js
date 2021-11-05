import React from 'react'
import Link from 'next/link'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import Search from 'antd/lib/input/Search'
const AppLayout = ({children}) => {
    const Container = styled.div`
        height: 60px;
        background-color: blue;
    `
    const Wrapper = styled.div`
        padding: 10px 20px;
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
    `
    const Center = styled.div`
        flex:1;
    `
    return (
        // <div>
        //     <div>
        //         <Link href="/"><a>StarClothes</a></Link>
        //         <Link href="/signup"><a>SIGN UP</a></Link>
        //         <Link href="/signin"><a>SIGN IN</a></Link>
        //         <Link href="/cart"><a>장바구니</a></Link>
        //     </div>
        // {children}
        // </div>
        <>
        <Container>
            <Wrapper>
                <Left>
                    <SearchContainer>
                        <Search allowClear style={{width: '20rem',}} placeholder="input search text"   />
                    </SearchContainer>
                </Left>
                <Center>안녕</Center>
                <Right>그래</Right>
            </Wrapper>
        </Container>
        </>
    )
}

AppLayout.propTypes={
    children: PropTypes.node.isRequired
}

export default AppLayout
