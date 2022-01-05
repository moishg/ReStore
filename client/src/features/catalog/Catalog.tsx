
import { useEffect, useState } from "react";

import LoadingComponent from "../../app/layout/LoadingComponent";

import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { fetchProductsAsync, productSelectors } from "./catalogSlice";
import ProductList from "./ProductList";


export default function Catalog() {
  const products = useAppSelector(productSelectors.selectAll);
  console.log(products);
  const dispatch = useAppDispatch(); //geeting acess for "dispatch"

  const { productsLoaded, status } = useAppSelector(state => state.catalog);
  useEffect(() => {
    console.log(productsLoaded);
    if (!productsLoaded) {//if products not loaded, activate dispatch  for fetching products to the  "products" list  object
      dispatch(fetchProductsAsync());

    }
  }, [productsLoaded, dispatch]); //[] - for only to becalled once 


  if (status.includes('pending')) // using the status for "loading" indicator
    return <LoadingComponent message='Loading products..' />
  else
    return (
      <>
        <ProductList products={products}></ProductList>
      </>
    )
} 