
import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { history } from "../..";
import { PaginatedResponse } from "../models/pagination";
import { store } from "../store/configureStore";

const sleep = () => new Promise(resolve => setTimeout(resolve, 500));

axios.defaults.baseURL = 'http://localhost:5003/api/';
axios.defaults.withCredentials = true;//the briowser will receive the cookie and set it in the app storage 

const responseBody = (response: AxiosResponse) => response.data;

axios.interceptors.request.use(config => {
    const token = store.getState().account.user?.token;
    if (token )
    { 
      //  console.log('headers',config.headers);
        config.headers!.Authorization = `Bearer ${token}`;
    }
     

    return config;
})

axios.interceptors.response.use(async response => {
    await sleep();
    const pagination = response.headers['pagination'];// axios params must be small letter    
    // console.log("response.headers:" , response.headers['date']);
    if (pagination) {
        response.data = new PaginatedResponse(response.data, JSON.parse(pagination));
        // console.log(response);
        return response;
    }
    return response
}, (error: AxiosError) => {
    const { data, status } = error.response!;//exclemation mark turn off the type safaty of typescript
    switch (status) {
        case 400:
            if (data.errors) {
                const modelStateErrors: string[] = [];
                for (const key in data.errors) {
                    if (data.errors[key]) {
                        modelStateErrors.push(data.errors[key])
                    }
                }
                throw modelStateErrors.flat();
            }

            toast.error(data.title);
            break;
        case 401:
            toast.error(data.title);                 
            break;
        case 500:
            history.push({
                pathname: '/server-error',
                state: { error: data }

            });
            //toast.error(data.title);
            break;
        default:
            break;
    }
    //console.log('caught by interceptor');
    return Promise.reject(error.response);
})

const requests = {
    get: (url: string, params?: URLSearchParams) => axios.get(url, { params }).then(responseBody),//geting the data from the server
    post: (url: string, body: {}) => axios.post(url, body).then(responseBody),//for creating resource on the server
    put: (url: string, body: {}) => axios.put(url, body).then(responseBody),//for update resource on the server
    delete: (url: string) => axios.delete(url).then(responseBody)////for deleting resource on the server
}

const Catalog = {
    list: (params: URLSearchParams) => requests.get('products', params),
    //list:()=>requests.get('buggy/server-error'),

    details: (id: number) => requests.get(`products/${id}`),

    fetchFilters: () => requests.get('products/filters')

}

const TestErrors = {
    get400Error: () => requests.get('buggy/bad-request'),
    get401Error: () => requests.get('buggy/unauthorized'),
    get404Error: () => requests.get('buggy/not-found'),
    get500Error: () => requests.get('buggy/server-error'),
    getValidationError: () => requests.get('buggy/validation-error')

}

const Basket = {
    get: () => requests.get('basket'),
    addItem: (productId: number, quantity = 1) => requests.post(`basket?productId=${productId}&quantity=${quantity}`, {}),
    removeItem: (productId: number, quantity = 1) => {

        const deleteUrl = `basket?productId=${productId}&quantity=${quantity}`;
        //console.log(deleteUrl);
        return requests.delete(`basket?productId=${productId}&quantity=${quantity}`);
    }

}


const Account = {
    //"values"  - will contain username and password for passing to server
    login: (values: any) => requests.post('account/login', values),
    register: (values: any) => requests.post('account/register', values),
    currentUser: () => requests.get('account/currentUser'),
    fetchAddress:()=>requests.get('account/savedAddress')
}

const Orders={
    list:()=>requests.get('orders'),
    fetch:(id:number)=>requests.get( `orders/${id}`),
    create:(values:any)=>requests.post('orders',values)


}

const agent = {
    Catalog,
    TestErrors,
    Basket,
    Account,
    Orders
}



export default agent
