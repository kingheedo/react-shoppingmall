import {Result, Button, Modal } from 'antd'
import React, { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RESET_ADD_PAYMENT } from '../reducers/user'

const ResultSuccess = () => {
  const {addPaymentDone} = useSelector(state => state.user)
    const [visible, setVisible] = useState(addPaymentDone)
    const dispatch = useDispatch()

    const handleCancel = useCallback(
        () => {
          setVisible(false)
          dispatch({
          type : RESET_ADD_PAYMENT
           })
        },
        [],
    )
    

    return (
        <>
        <Modal
          centered={true}
          visible={visible}
          onCancel={handleCancel}
          footer={[
            <Button onClick={handleCancel}>
              확인
            </Button>,
          ]}
        >
          <Result
            status="success"
            title="결제가 완료되었습니다."
        />,
        </Modal>
      </>
    )
}

export default ResultSuccess
