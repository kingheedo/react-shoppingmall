import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { backUrl } from '../../config/backUrl';

axios.defaults.baseURL = backUrl;
axios.defaults.withCredentials = true;
export const searchProducts = createAsyncThunk('search/products', async (data: string) => {
  try {
    const res = await axios.get(`/product/name/${encodeURIComponent(data)}`);
    return res.data;
  } catch (err:any) {
    throw err.response.data;
  }
});

export const registerProduct = createAsyncThunk('register/product', async (data: FormData) => {
  try {
    const res = await axios.post('/product', data);
    return res.data;
  } catch (err:any) {
    throw err.response.data;
  }
});

export const uploadImages = createAsyncThunk('upload/images', async (data: FormData) => {
  try {
    const res = await axios.post('/product/images', data);
    return res.data;
  } catch (err:any) {
    throw err.response.data;
  }
});

export const addProductReview = createAsyncThunk('add/productReview', async (data: {reviewUnique: string, historyCartId: number, productId: number, content: string, rate:number, paymentToken:string, }) => {
  try {
    const res = await axios.post(`/product/${data.productId}/review`, data);
    return res.data;
  } catch (err:any) {
    throw err.response.data;
  }
});

export const loadProducts = createAsyncThunk('load/products', async (lastId?: number) => {
  try {
    const res = await axios.get(`/products?lastId=${lastId || 0}`);
    return res.data;
  } catch (err:any) {
    throw err.response.data;
  }
});

export const loadSingleProduct = createAsyncThunk('load/singleProduct', async (id:string) => {
  try {
    const res = await axios.get(`/product/${id}`);
    return res.data;
  } catch (err:any) {
    throw err.response.data;
  }
});
