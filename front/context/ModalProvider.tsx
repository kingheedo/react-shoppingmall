'use client';
import {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';
import ConfirmModal from '../components/common/ConfirmModal';

export enum ConfirmType {
  ADD_CART = 'ADD_CART',
  DELETE_CART = 'DELETE_CART',
  SIZE_SELECT = 'SIZE_SELECT',
  NO_SELECT_CART_ITEM = 'NO_SELECT_CART_ITEM',
  SAVE_ADDRESS = 'SAVE_ADDRESS'
}

interface IModalContext {
  confirm: {
    addCart: {
      open: boolean;
      handleConfirm: (cb: () => void) => void;
    };
    deleteCart: {
      open: boolean;
      handleConfirm: (cb: () => void) => void;
    }
    sizeSlct: {
      open: boolean;
      handleConfirm: () => void;
    };
    noSelectCartItem:{
      open: boolean;
      handleConfirm: () => void;
    };
    saveAddress: {
      open: boolean;
      handleConfirm: (cb: () => void) => void;
    }
  };
}

const ModalContext = createContext<IModalContext | null>(null);

const ModalProvider = ({ children }: PropsWithChildren) => {
  const [confirm, setConfirm] = useState({
    type: ConfirmType.ADD_CART,
    open: false,
    callBack: () => {
      null;
    },
  });

  const value = useMemo(
    () => ({
      confirm: {
        addCart: {
          open: confirm.open,
          handleConfirm: (cb: () => void) =>
            setConfirm({
              type: ConfirmType.ADD_CART,
              open: true,
              callBack: cb,
            }),
        },
        deleteCart: {
          open: confirm.open,
          handleConfirm: (cb: () => void) => 
            setConfirm({
              type: ConfirmType.DELETE_CART,
              open: true,
              callBack: cb
            })
        },
        sizeSlct: {
          open: confirm.open,
          handleConfirm: () =>
            setConfirm({
              ...confirm,
              type: ConfirmType.SIZE_SELECT,
              open: true,
              callBack: () => {
                null;
              },
            }),
        },
        noSelectCartItem: {
          open: confirm.open,
          handleConfirm: () => 
            setConfirm({
              type: ConfirmType.NO_SELECT_CART_ITEM,
              open: true,
              callBack: () => {null;}
            })
        },
        saveAddress: {
          open: confirm.open,
          handleConfirm: (cb: () => void) => {
            setConfirm({
              type: ConfirmType.SAVE_ADDRESS,
              open: true,
              callBack: cb
            });
          }
        }
      },
    }),
    [confirm],
  );

  return (
    <ModalContext.Provider value={value}>
      {confirm.open && (
        <ConfirmModal
          type={confirm.type}
          onOk={() => {
            setConfirm({ ...confirm, open: false });
            confirm.callBack();
          }}
          onClose={() => setConfirm({ ...confirm, open: false })}
        />
      )}
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => ModalContext && useContext(ModalContext);

export default ModalProvider;
