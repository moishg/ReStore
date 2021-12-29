using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    public class Basket
    {
        public int Id { get; set; }
        public string buyerId { get; set; }//autogen id for tracking whhich basket belongs to who 

        //basketId-BasketItemId===>1:n
        public List<BasketItem> Items { get; set; } = new();//===new List<BasketItem>();

        public void AddItem(Product product, int quantity)
        {
            //if we dont have the product in the baseket, add new one , elese ,incraease the quntity of the product
            if (Items.All(item => item.ProductId != product.Id))
            {
                BasketItem basketItem = new BasketItem
                {
                    Product = product,
                    Quantity = quantity
                };

                Items.Add(basketItem);               
            }
            else 
            {
                 BasketItem existingItem = Items.FirstOrDefault(item => item.ProductId == product.Id);
                if (existingItem != null)
                {
                    existingItem.Quantity += quantity;
                }
            }
        }

        public void RemoveItem(int productId,int quantity)
        {
            var item=Items.FirstOrDefault(basketItem=>basketItem.Product.Id==productId);
            if(item==null)//productId not exists
            {
                return;  
            }
            else//product exists
            {
                item.Quantity-=quantity;//subtract the quantity
                if(item.Quantity==0)//removing the product if quantity==0
                {
                    Items.Remove(item);
                }
            }
            



        }

    }
}