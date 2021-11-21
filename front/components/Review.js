import { Button, Divider, List, Modal, Rate, Input  } from 'antd';
import React, { useCallback, useEffect, useState } from 'react'
import Proptypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux';
import { ADD_PRODUCT_REVIEW_REQUEST } from '../reducers/product';
const Review = ({product}) => {
    const {me} = useSelector(state => state.user)
    const { TextArea } = Input;
    
    const [reviewContent, setReviewContent] = useState('')
    const [reviewRate, setReviewRate] = useState(2.5)
    const [visibleModal, setVisibleModal] = useState(false)
    const dispatch = useDispatch()
    const WhoBuyedProduct = product.notYetReivewers && product.notYetReivewers.find(v => v.id === (me && me.User.id))

   
    const onClickReview = useCallback(
        () => {
            if(reviewContent === ''){
                return alert('내용을 입력하세요')
            }
            if(reviewContent.length <= 20){
                return alert('최소 20글자를 입력해주세요 ')
            }
            if(reviewRate === 0){
                return alert('별점을 평가해주세요.')
            }
            dispatch({
                type: ADD_PRODUCT_REVIEW_REQUEST,
                data : {userId: me.User.id, productId: product.id, Content: reviewContent, Rate: reviewRate}
            })
            setVisibleModal(false)
        },
        [reviewContent,reviewRate],
    )

    const onChangeText = useCallback(
        (e) => {
            setReviewContent(e.target.value)
        },
        [],
    )
    const onChangeRate = useCallback(
        (reviewRate) => {
            console.log(reviewRate)
            setReviewRate(reviewRate)
        },
        [reviewRate],
    )
    return (
        <>
            <Divider orientation="left">상품 리뷰</Divider>
             <List
                itemLayout="vertical"
                size="large"
                pagination={{
                onChange: page => {
                    console.log(page);
                },
                pageSize: 3,
                }}
                dataSource={product.Reviews}
                footer={
                     WhoBuyedProduct ?
                    <div>
                    <Button onClick={() => setVisibleModal(true)}>작성하기</Button>
                </div> : null
                }
                renderItem={item => (
                <List.Item
                    key={item.id}
                    extra={
                    <img
                        width={272}
                        alt="logo"
                        src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                    />
                    }
                >
                    <List.Item.Meta
                    description={item.User.email}
                    />
                    <Rate disabled defaultValue={item.rate} />
                    <br/>
                    {item.content}
                </List.Item>
                )}
            />
                <Modal
                        style={{top: '10rem'}}
                        visible={visibleModal}
                        footer={
                            [<Button onClick={onClickReview} key="write">작성</Button>,
                        <Button onClick={() => setVisibleModal(false)} key="cancel">취소</Button>,
                        ]}
                        onCancel = {() => setVisibleModal(false)}
                        >
                            <Rate allowHalf  value={reviewRate} onChange={onChangeRate} />
                            <TextArea showCount maxLength={100} onChange={onChangeText} value={reviewContent} />
                            
                </Modal>
        </>
    )
}
Review.propTypes = {
    product: Proptypes.object.isRequired,
}
export default Review
