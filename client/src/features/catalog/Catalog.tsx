 
import { useEffect, useState } from "react";
import { Product } from "../../app/models/product";
import ProductList from "./ProductList";

 
export default function Catalog(){
    const [products,setProducts]=useState<Product[]>([]);
    useEffect(() => {
        fetch('http://localhost:5003/api/products')
          .then(response => response.json())
          .then(data => setProducts(data))
      }, []); //[] - for only to becalled once 
              
    return (
        <> 
            <ProductList products={products}></ProductList>          
       </>
    )
}