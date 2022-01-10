
import { Box, Grid, Pagination, Paper, Typography } from "@mui/material";
import { useEffect } from "react";
import AppPagination from "../../app/components/AppPagination";
import CheckboxButtons from "../../app/components/CheckboxButtons";
import CheckBoxButtons from "../../app/components/CheckboxButtons";
import RadioButtonGroup from "../../app/components/RadioButtonGroup";

import LoadingComponent from "../../app/layout/LoadingComponent";

import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { fetchFilters, fetchProductsAsync, productSelectors, setProductParams } from "./catalogSlice";
import ProductList from "./ProductList";
import ProductSearch from "./productSearch";


const sortOptions = [
  { value: 'name', label: 'Alphabetical' },
  { value: 'priceDesc', label: 'Price - High to low' },
  { value: 'price', label: 'Price - Low to high' }
]


export default function Catalog() {
  const products = useAppSelector(productSelectors.selectAll);

  //console.log(products);
  const dispatch = useAppDispatch(); //geeting acess for "dispatch"

  //getting data from the redux  store:
  const { productsLoaded, status, filtersLoaded, brands, types, productParams, metaData } = useAppSelector(state => state.catalog);

  useEffect(() => {

    if (!productsLoaded) //if products not loaded, activate dispatch  for fetching products to the  "products" list  object
      dispatch(fetchProductsAsync());

  }, [productsLoaded, dispatch]); //[] - for only to becalled once 

  useEffect(() => {

    if (!filtersLoaded)
      dispatch(fetchFilters());

  }, [dispatch, filtersLoaded]); //[] - for only to becalled once 




  if (status.includes('pending') || !metaData) // using the status for "loading" indicator
    return <LoadingComponent message='Loading products..' />
  else
    return (
      <Grid container spacing={4}>
        <Grid item xs={3}>
          <Paper sx={{ mb: 2 }}>
            <ProductSearch />
          </Paper>
          <Paper sx={{ mb: 2, p: 2 }}>
            <RadioButtonGroup
              selectedValue={productParams.orderBy}
              options={sortOptions}
              onChange={(e) => dispatch(setProductParams({ orderBy: e.target.value }))}
            />


          </Paper>
          <Paper sx={{ mb: 2, p: 2 }}>
            <CheckboxButtons
              items={brands}
              checked={productParams.brands}
              onChange={(items: string[]) => dispatch(setProductParams({ brands: items }))}
            />


          </Paper>
          <Paper sx={{ mb: 2, p: 2 }}>
            <CheckboxButtons
              items={types}
              checked={productParams.types}
              onChange={(items: string[]) => dispatch(setProductParams({ types: items }))}
            />
          </Paper>


        </Grid>
        <Grid item xs={9}>
          <ProductList products={products}></ProductList>
        </Grid>

        <Grid item xs={3} />
        <Grid item xs={9}>
          <AppPagination
            metaData={metaData}
            onPageChange={(page: number) => dispatch(setProductParams({ pageNumber: page }))}
            />           
        </Grid>
      </Grid>
    )
} 