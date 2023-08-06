import React from 'react'
import styled from 'styled-components'

const Bg = styled.div`
    position: fixed;
    display: grid;
    place-content: center;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0, 0.25);
    z-index: 100;
`
const ContentArea = styled.div`
    width: 460px;
    height: 230px;
    overflow: hidden;
    display: block;
    z-index: 101;
    padding: 40px 30px;
    min-width: 400px;
    border: 0;
    border-radius: 0;
    background: #fff;
`
const Content = styled.div`
    padding: 0 0 40px;
    text-align: center;
    line-height: 1.6em;
    font-size: 19px;
    font-weight: 700;
    color: #333;
`
const ButtonWrap = styled.div`
    display: flex;
`
const Button = styled.button`
    cursor: pointer;
    margin: 0;
    width: calc(50% - 4px);
    height: 50px;
    line-height: 48px;
    font-weight: 400;
    font-size: 15px;
    box-sizing: border-box;
    border-radius: 0;

     &:nth-child(1){
        color: #fff;
        background: #111;
        border: 1px solid #111;
     }

     &:nth-child(2){
        margin-left: 8px;
        color: #111;
        background: #fff;
     }
`

interface IConfirmModalProps {
    onOk: () => void;
    onClose: () => void;
}

const ConfirmModal = ({
    onOk,
    onClose
}: IConfirmModalProps) => {

    const onClickOk = () => {
        
    }
  return (
    <Bg onClick={onClose}>
        <ContentArea onClick={e => e.stopPropagation()}>
            <Content>
                장바구니에 상품이 담겼습니다.
                <br/>
                장바구니로 이동하시겠습니까?
            </Content>
            <ButtonWrap>
                <Button onClick={() => onOk()}>
                    확인
                </Button>
                <Button onClick={onClose}>
                    취소
                </Button>
            </ButtonWrap>
        </ContentArea>
    </Bg>
  )
}

export default ConfirmModal