 
import { useEffect, useState } from "react";
import agent from "../../app/api/agent";
import { Product } from "../../app/models/product";
import ProductList from "./ProductList";

 
export default function Catalog(){
    const [products,setProducts]=useState<Product[]>([]);
    useEffect(() => {
      agent.Catalog.list().then(products=>setProducts(products))
        //  fetch('http://localhost:5003/api/products')
      //    .then(response => response.json())
      //    .then(data => setProducts(data))
      }, []); //[] - for only to becalled once 
              
    return (
        <> 
            <ProductList products={products}></ProductList>          
       </>
    )
}