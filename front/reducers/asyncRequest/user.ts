import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { backUrl } from '../../config/backUrl';

axios.defaults.baseURL = backUrl;
axios.defaults.withCredentials = true;

export const loadPaymentLists = createAsyncThunk('load/paymentLists', async () => {
  try {
    const res = await axios.get('/user/paymentsList');
    return res.data;
  } catch (err:any) {
    throw err.response.data;
  }
});

export const addPayment = createAsyncThunk('user/payment', async (data:{ CartItemId? : number, CartItemsId?: number[], payment : any}) => {
  try {
    const res = await axios.post('/user/payment', data);
    return res.data;
  } catch (err:any) {
    throw err.response.data;
  }
});

export const loadUser = createAsyncThunk('load/user', async () => {
  try {
    const res = await axios.get('/user');
    return res.data;
  } catch (err:any) {
    throw err.response.data;
  }
});

export const logOut = createAsyncThunk('user/logout', async () => {
  try {
    await axios.post('/user/logout');
  } catch (err:any) {
    throw err.response.data;
  }
});

export const logIn = createAsyncThunk('user/login', async (data: {email : string, password : string, }) => {
  try {
    const res = await axios.post('/user/login', data);
    return res.data;
  } catch (err:any) {
    throw err.response.data;
}
});

export const signUp = createAsyncThunk('user/siginUp', async (data: {email : string, name : string, password : string, }) => {
  try {
    await axios.post('/user', data);
  } catch (err:any) {
    throw err.response.data;
  }
});
