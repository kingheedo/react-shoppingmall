import { PropsWithChildren, createContext, useContext, useEffect, useMemo, useState } from "react";
import ConfirmModal from "../components/common/ConfirmModal";

export enum ConfirmType  {
    ADD_CART = 'ADD_CART',
    SIZE_SELECT = 'SIZE_SELECT'
}

interface IModalContext {
    confirm: {
        addCart : {
            open : boolean;
            handleConfirm: (cb: () => void) => void;
        },
        sizeSlct : {
            open : boolean;
            handleConfirm: () => void;
        }
    }
}

const ModalContext = createContext<IModalContext | null>(null);

const ModalProvider = ({children}: PropsWithChildren) => {
    const [confirm, setConfirm] = useState({
        type: ConfirmType.ADD_CART,
        open: false,
        callBack: () => {}
    })
    
    

    const value = useMemo(() => ({
        confirm: {
            addCart: {
                open: confirm.open,
                handleConfirm: (cb: () => void) => setConfirm({
                    type :ConfirmType.ADD_CART, 
                    open: true, 
                    callBack: cb
                })
            },
            sizeSlct: {
                open: confirm.open,
                handleConfirm: () => setConfirm({
                    ...confirm,
                    type: ConfirmType.SIZE_SELECT,
                    open: true
                })
            }
        }
    }), [confirm])

    return (
            <ModalContext.Provider value={value}>
                {confirm.open && (
                    <ConfirmModal 
                        type={confirm.type}
                        onOk={() => {
                            setConfirm({...confirm, open: false});
                            confirm.callBack();
                        }}
                        onClose={() => setConfirm({...confirm, open: false})}/>
                )}
                {children}
            </ModalContext.Provider>
        )
}

export const useModal = () => ModalContext && useContext(ModalContext);

export default ModalProvider;