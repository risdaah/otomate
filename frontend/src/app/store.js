import { configureStore } from '@reduxjs/toolkit'
import headerSlice from '../features/common/headerSlice'
import modalSlice from '../features/common/modalSlice'
import rightDrawerSlice from '../features/common/rightDrawerSlice'
import leadsSlice from '../features/leads/leadSlice'
import categoryReducer from '../features/product/category/categorySlice'
import productSlice from '../features/product/allProduct/productSlice'
import supplierReducer from '../features/supplier/supplierSlice';
import supplyReducer from '../features/supply/allRFQ/supplySlice';
import userReducer from '../features/people/peopleSlice';
import authReducer from '../features/auth/authSlice';

const combinedReducer = {
  header : headerSlice,
  rightDrawer : rightDrawerSlice,
  modal : modalSlice,
  lead : leadsSlice,
  Category: categoryReducer,
  Product: productSlice,
  Supplier: supplierReducer,
  Supply: supplyReducer,
  User: userReducer,
  auth: authReducer
}

export default configureStore({
    reducer: combinedReducer
})
