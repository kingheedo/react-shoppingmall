import { createSlice } from '@reduxjs/toolkit';
import _concat from 'lodash/concat';
import {
  ProductState,
} from './reducerTypes/productType';
import {
 loadProducts, loadSingleProduct, registerProduct, searchProducts, uploadImages,
} from './asyncRequest/product';

export const productSlice = createSlice({
  name: 'product',
  initialState: {
  mainProducts: [],
  singleProduct: null,
  imagePath: [],
  searchProductsList: [],
  hasMoreProducts: false,
  registerProductLoading: false,
  registerProductDone: false,
  registerProductError: null,
  uploadImagesLoading: false,
  uploadImagesDone: false,
  uploadImagesError: null,
  loadProductsLoading: false,
  loadProductsDone: false,
  loadProductsError: null,
  loadProductLoading: false,
  loadProductDone: false,
  loadProductError: null,
  searchProductsLoading: false,
  searchProductsDone: false,
  searchProductsError: null,
} as ProductState,
reducers: {
  removeImage: (state, action) => {
    const newImagePath = state.imagePath.filter((v:string, i:number) => i !== action.payload);
    state.imagePath = newImagePath;
  },
},
extraReducers: {
  [uploadImages.pending as any]: (state) => {
    state.uploadImagesLoading = true;
    state.uploadImagesDone = false;
    state.uploadImagesError = false;
  },
  [uploadImages.fulfilled as any]: (state, action) => {
    state.uploadImagesLoading = false;
    state.uploadImagesDone = true;
    state.imagePath = action.payload;
  },
 [uploadImages.rejected as any]: (state, action) => {
    state.uploadImagesLoading = false;
    state.uploadImagesDone = false;
    state.uploadImagesError = action.error.message;
  },
  [registerProduct.pending as any]: (state) => {
    state.registerProductLoading = true;
    state.registerProductDone = false;
    state.registerProductError = false;
  },
  [registerProduct.fulfilled as any]: (state, action) => {
    state.registerProductLoading = false;
    state.registerProductDone = true;
    state.mainProducts.unshift(action.payload);
    state.imagePath = [];
  },
 [registerProduct.rejected as any]: (state, action) => {
    state.registerProductLoading = false;
    state.registerProductDone = false;
    state.registerProductError = action.error.message;
  },
  [searchProducts.pending as any]: (state) => {
    state.searchProductsLoading = true;
    state.searchProductsDone = false;
    state.searchProductsError = false;
  },
  [searchProducts.fulfilled as any]: (state, action) => {
    state.searchProductsLoading = false;
    state.searchProductsDone = true;
    state.searchProductsList = action.payload;
  },
 [searchProducts.rejected as any]: (state, action) => {
    state.searchProductsLoading = false;
    state.searchProductsDone = false;
    state.searchProductsError = action.error.message;
  },
  [loadProducts.pending as any]: (state) => {
    state.loadProductsLoading = true;
    state.loadProductsDone = false;
    state.loadProductsError = false;
  },
  [loadProducts.fulfilled as any]: (state, action) => {
    state.loadProductsLoading = false;
    state.loadProductsDone = true;
    state.mainProducts = state.mainProducts.concat(action.payload);
    state.hasMoreProducts = action.payload.length === 4;
    },
  [loadProducts.rejected as any]: (state, action) => {
    state.loadProductsLoading = false;
    state.loadProductsDone = false;
    state.loadProductsError = action.error.message;
  },
  [loadSingleProduct.pending as any]: (state) => {
    state.loadProductLoading = true;
    state.loadProductDone = false;
    state.loadProductError = false;
  },
 [loadSingleProduct.fulfilled as any]: (state, action) => {
    state.loadProductLoading = false;
    state.loadProductDone = true;
    state.singleProduct = action.payload;
  },
  [loadSingleProduct.rejected as any]: (state, action) => {
    state.loadProductLoading = false;
    state.loadProductDone = false;
    state.loadProductError = action.error.message;
  },

},
});
export const {
removeImage,
} = productSlice.actions;
export default productSlice.reducer;
