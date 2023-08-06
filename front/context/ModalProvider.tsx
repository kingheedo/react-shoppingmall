import { PropsWithChildren, createContext, useContext, useEffect, useMemo, useState } from "react";
import ConfirmModal from "../components/common/ConfirmModal";

interface IModalContext {
    confirm: {
        open : boolean;
        callBack: (cb: () => void) => void;
        handleConfirm: (open: boolean) => void;
    }
}

const ModalContext = createContext<IModalContext | null>(null);

const ModalProvider = ({children}: PropsWithChildren) => {
    const [confirm, setConfirm] = useState({
        open: false,
        callBack: () => {}
    })
    
    

    const value = useMemo(() => ({
        confirm: {
            open: confirm.open,
            callBack: (cb: () => void) => {
                setConfirm({...confirm, callBack: cb})
                
            },
            handleConfirm: (open:boolean) => setConfirm({...confirm, open})
        }
    }), [confirm])

    return (
            <ModalContext.Provider value={value}>
                {confirm.open && (
                    <ConfirmModal 
                        onOk={confirm.callBack}
                        onClose={() => value.confirm.handleConfirm(false)}/>
                )}
                {children}
            </ModalContext.Provider>
        )
}

export const useModal = () => ModalContext && useContext(ModalContext);

export default ModalProvider;