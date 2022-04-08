/* eslint-disable no-unused-vars */
declare module 'react-paypal-express-checkout' {
  declare function PaypalExpressBtn(prop:{
  env: string;
    client:{
      sandbox: string;
      production: string;
    }
    currency: string;
    total: number;
    onError: (err: any) => void;
    onSuccess: (err: any) => void;
    onCancel: (err: any) => void;
    style : {
        size: 'large',
        color: 'blue',
        shape: 'rect',
        label: 'checkout',
      }
  }
  )
}
