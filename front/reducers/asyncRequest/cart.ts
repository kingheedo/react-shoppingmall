import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AddProductData } from '../asyncRequestTypes/cartRequest';
import { backUrl } from '../../config/backUrl';

axios.defaults.baseURL = backUrl;
axios.defaults.withCredentials = true;
export const deleteProductInCart = createAsyncThunk('delete/productInCart', async (data:{id: number}) => {
  try {
    const res = await axios.delete(`/cart/${data.id}`);
    return res.data;
  } catch (err: any) {
    throw err.response.data;
  }
});

export const loadProductsInCart = createAsyncThunk('load/cartProducts', async () => {
  try {
      const res = await axios.get('/cart');
    return res.data;
  } catch (err:any) {
    throw err.response.data;
  }
});

export const addProductToCart = createAsyncThunk('add/productCart', async (data: AddProductData) => {
  try {
    const res = await axios.post('/cart', data);
    return res.data;
  } catch (err:any) {
    throw err.response.data;
  }
});
