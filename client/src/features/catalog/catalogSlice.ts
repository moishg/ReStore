import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import agent from "../../app/api/agent";
import { MetaData } from "../../app/models/pagination";
import { Product, ProductParams } from "../../app/models/product";
import { RootState } from "../../app/store/configureStore";

interface CatalogState {
    productsLoaded: boolean;
    filtersLoaded: boolean;
    status: string;
    brands: string[];
    types: string[];
    productParams: ProductParams;
    metaData: MetaData | null
}

const productsAdapter = createEntityAdapter<Product>();

function getAxiosParams(productParams: ProductParams) {
    const params = new URLSearchParams();
    params.append('pageNumber', productParams.pageNumber.toString());
    params.append('pageSize', productParams.pageSize.toString());
    params.append('orderBy', productParams.orderBy.toString());

    if (productParams.searchTerm)
        params.append('searchTerm', productParams.searchTerm.toString());

    if (productParams.brands.length > 0)
        params.append('brands', productParams.brands.toString());


    if (productParams.types.length > 0)
        params.append('types', productParams.types.toString());

    return params;

}

export const fetchProductsAsync = createAsyncThunk<Product[], void, { state: RootState }>(
    'catalog/fetchProductsAsync',
    async (_, thunkAPI) => {
        const params = getAxiosParams(thunkAPI.getState().catalog.productParams)
        try {
            const response = await agent.Catalog.list(params);//getting the products lists 
            //console.log(response.metaData);
            thunkAPI.dispatch(setMetaData(response.metaData));
            //return response;

            return response.items;//return the products items  and  updating the redux state
        }
        catch (error: any) {
            //console.log(error); 
            return thunkAPI.rejectWithValue({ error: error.data }); /// if a problem accurs , "reject" case happen (and not "fulfilled")          
        }
    }
)

export const fetchProductAsync = createAsyncThunk<Product, number>(
    'catalog/fetchProductAsync',
    async (productId, thunkAPI) => {
        try {
            return await agent.Catalog.details(productId);//getting the products lists 
        }
        catch (error: any) {
            // console.log(error);
            return thunkAPI.rejectWithValue({ error: error.data }); /// if a problem accurs , "reject" case happen (and not "fulfilled")
        }
    }
)


export const fetchFilters = createAsyncThunk(
    'catalog/fetchFilters',
    async (_, thunkAPI) => {
        try {
            return agent.Catalog.fetchFilters();
        }
        catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.data });
        }
    }
)

function initParams() {
    return {
        pageNumber: 1,
        pageSize: 6,
        orderBy: 'name',
        types: [],
        brands: []
    }
}

export const catalogSlice = createSlice(
    {
        name: 'catalog',
        initialState: productsAdapter.getInitialState<CatalogState>({
            productsLoaded: false,
            filtersLoaded: false,
            status: 'idle',
            brands: [],
            types: [],
            productParams: {
                pageNumber: 1,
                pageSize: 6,
                orderBy: 'name',
                types: [],
                brands: []
            },
            metaData: null
        }),
        reducers: {//reducer functions : 
            setProductParams: (state, action) => {
                state.productsLoaded = false;//its false cause we want to trigger it with the useEffect
                state.productParams = { ...state.productParams, ...action.payload, pageNumber: 1 }
            },
            setPageNumber: (state, action) => {
                state.productsLoaded = false;
                state.productParams = { ...state.productParams, ...action.payload }

            },
            setMetaData: (state, action) => {
                state.metaData = action.payload//the payload will contain the "paging" metadata ( currentPage,totalPages, pageSize,totalCount )


            },
            resetProductParams: (state) => {//resetting the prodcutParams
                state.productParams = initParams();
            },
            setProduct: (state, action) => {
                productsAdapter.upsertOne(state, action.payload);// the payload will contain the product data (id,number,descrition,type ,brand, price, pictureUrl..)
                state.productsLoaded = false;
            },
            removeProduct: (state, action) => {
                productsAdapter.removeOne(state, action.payload)//the payload will contain the "id" of the product
                state.productsLoaded = false;
            }

        },
        extraReducers: (builder => {
            //----------------------------------------------------------
            //cases for fetchProductsAsyc async  method -"products list"
            //----------------------------------------------------------
            builder.addCase(fetchProductsAsync.pending, (state) => {
                //console.log(action);
                state.status = 'pendingFetchProducts';//setting the state status to "pending" state
            });

            builder.addCase(fetchProductsAsync.fulfilled, (state, action) => {
                productsAdapter.setAll(state, action.payload);//needed action for the "products" paylod list
                state.status = 'idle';//setting the state status to "fulfilled" state
                state.productsLoaded = true;
            });
            builder.addCase(fetchProductsAsync.rejected, (state, action) => {
                console.log(action.payload);
                state.status = 'idle';//setting the state status to "rejected" state
            });

            //-----------------------------------------------------------
            //cases for - fetchProductAsyc async  method - single "product"
            //------------------------------------------------------------
            builder.addCase(fetchProductAsync.pending, (state) => {
                //console.log(action);
                state.status = 'pendingFetchProduct';//setting the state status to "pending" state
            });

            builder.addCase(fetchProductAsync.fulfilled, (state, action) => {
                productsAdapter.upsertOne(state, action.payload);//needed action for the "product" paylod 
                state.status = 'idle';//setting the state status to "fulfilled" state    
                state.productsLoaded = false;
            });

            builder.addCase(fetchProductAsync.rejected, (state, action) => {
                console.log(action);
                state.status = 'idle';//setting the state status to "rejected" state
            });

            //-----------------------------------------------------------
            //cases for - fetchFiltersAsyc async  method -   "products" list
            //------------------------------------------------------------
            builder.addCase(fetchFilters.pending, (state) => {
                //console.log(action);
                state.status = 'pendingFetchFilters';//setting the state status to "pending" state
            });

            builder.addCase(fetchFilters.fulfilled, (state, action) => {
                state.brands = action.payload.brands;
                state.types = action.payload.types;
                state.filtersLoaded = true;
                state.status = 'idle';
            });

            builder.addCase(fetchFilters.rejected, (state, action) => {

                state.status = 'idle';//setting the state status to "rejected" state
                console.log(action.payload);
            });
        })
    })

export const productSelectors = productsAdapter.getSelectors((state: RootState) => state.catalog);//selecting the "catalog" slice 


export const { setProductParams, resetProductParams, setMetaData, setPageNumber, setProduct, removeProduct } = catalogSlice.actions;
