import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/store/configureStore";
import { productSelectors, fetchProductsAsync, fetchFilters } from "../features/catalog/catalogSlice";

export default function useProducts(){
    const products = useAppSelector(productSelectors.selectAll);

  
    const dispatch = useAppDispatch(); //geeting access for "dispatch"
  
    //getting data from the redux  store:
    const { productsLoaded, filtersLoaded, brands, types, metaData } = useAppSelector(state => state.catalog);
  
    useEffect(() => {
  
      if (!productsLoaded) //if products not loaded, activate dispatch  for fetching products to the  "products" list  object
        dispatch(fetchProductsAsync());
  
    }, [productsLoaded, dispatch]); //[] - for only to becalled once 
  
    useEffect(() => {
  
      if (!filtersLoaded)
        dispatch(fetchFilters());
  
    }, [dispatch, filtersLoaded]); //[] - for only to becalled once 


    return {
        products,
        productsLoaded,
        filtersLoaded,
        brands,
        types,
        metaData
    }
}
 