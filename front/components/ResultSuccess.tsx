import { Result, Button, Modal } from 'antd';
import React, { FC, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../reducers';
import { UserState } from '../reducers/reducerTypes/userTypes';
import { resetAddPayment } from '../reducers/dispatchRequestTypes/userDispatchRequest';

const ResultSuccess: FC = () => {
  const { addPaymentDone } = useSelector<RootState, UserState>((state) => state.user);
  const [visible, setVisible] = useState(addPaymentDone);
  const dispatch = useDispatch();

  const handleCancel = useCallback(
    () => {
      setVisible(false);
      dispatch(resetAddPayment());
    },
    [],
  );

  return (
    <>
      <Modal
        centered
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
        />
        ,
      </Modal>
    </>
  );
};

export default ResultSuccess;
