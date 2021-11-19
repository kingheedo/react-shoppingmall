import { Button, Divider, List, Modal, Result } from 'antd';
import React, { useCallback, useEffect, useState } from 'react'
import Proptypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux';
import TextArea from 'rc-textarea';
import { ADD_PRODUCT_REVIEW_REQUEST } from '../reducers/product';
const Review = ({product}) => {
    const {me} = useSelector(state => state.user)

    
    const [reviewContent, setReviewContent] = useState('')
    const [visibleModal, setVisibleModal] = useState(false)
    const dispatch = useDispatch()
    const WhoBuyedProduct = product.notYetReivewers && product.notYetReivewers.find(v => v.id === (me && me.User.id))

   
    const onClickReview = useCallback(
        () => {
            dispatch({
                type: ADD_PRODUCT_REVIEW_REQUEST,
                data : {userId: me.User.id, productId: product.id, Content: reviewContent}
            })
            setVisibleModal(false)
        },
        [reviewContent],
    )

    const onChangeText = useCallback(
        (e) => {
            setReviewContent(e.target.value)
        },
        [],
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
                            <TextArea showCount minLength ={20} maxLength={100} onChange={onChangeText} value={reviewContent} />
                            
                </Modal>
        </>
    )
}
Review.propTypes = {
    product: Proptypes.object.isRequired,
}
export default Review
