using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class BasketController : BaseApiController
    {
        private readonly StoreContext _context;

        public BasketController(StoreContext context)
        {
            _context = context;
        }


        private BasketDto MapBasketToDto(Basket basket)
        {
             BasketDto  basketDto=new BasketDto{
                    Id=basket.Id,
                    BuyerId=basket.buyerId,
                    Items=basket.Items.Select(item=>new BasketItemDto{
                        ProductId=item.ProductId,
                        Name=item.Product.Name,
                        Price=item.Product.Price,
                        PictureUrl=item.Product.PictureUrl,
                        Brand=item.Product.Brand,     
                        Type=item.Product.Type ,                   
                        Quantity=item.Quantity
                    }).ToList()
                };

                return basketDto;
        }


        [HttpGet(Name="GetBasket")]
        public async Task<ActionResult<BasketDto>> GetBasket()
        {
            Basket basket = await RetrieveBasket();
            if (basket == null)
                return NotFound();
            else
            { 
                BasketDto  basketDto= MapBasketToDto(basket);
                 

                return basketDto;
            }
        }

        [HttpPost]//api/basket?productId=3&quantity=2
        public async Task<ActionResult> AddItemToBasket(int productId, int quantity)
        {
            //add item steps :
            //1.get basket ||create basket            
            Basket basket=await RetrieveBasket();
            if(basket==null)
                basket=CreateBasket();
                
            //2.get product
            Product product=await _context.Products.FindAsync(productId);
            if(product==null)
                return BadRequest(new ProblemDetails{Title="Item Not Found"});

            //3.add item 
            basket.AddItem(product,quantity);

            //4.save changes

            int result=await _context.SaveChangesAsync();
            if(result>0)  
            { 
               // return StatusCode(201);
               BasketDto basketDto=MapBasketToDto(basket);
               return CreatedAtRoute("GetBasket",basketDto);
            }
            else
            { 
                ProblemDetails problemDetails=new ProblemDetails{Title="problem saving to basket"};

                return BadRequest(problemDetails);
            }
        }

        [HttpDelete]
        public  async Task<ActionResult>  RemoveBasketItem(int productId, int quantity)
        {
            //remove item steps:
            //1.get basket
             Basket basket=await RetrieveBasket();
             if(basket==null)
                return NotFound();

                            
            //2.remove item or reduce quantity
            basket.RemoveItem(productId,quantity);

            //3.save changes
             int result=await _context.SaveChangesAsync();
            if(result>0)                 
                return StatusCode(201);
            else
            { 
                ProblemDetails problemDetails=new ProblemDetails{Title="problem removing from basket"};

                return BadRequest(problemDetails);
            }            
        }


        private async Task<Basket> RetrieveBasket()
        {
            Basket basket = await _context.Baskets
                                .Include(i => i.Items)//include the items information 
                                .ThenInclude(p => p.Product)//include the product in the items
                                .FirstOrDefaultAsync(x => x.buyerId == Request.Cookies["buyerId"]);

            return basket;
        }

        private Basket CreateBasket()
        {
            string  buyerId=Guid.NewGuid().ToString();
            //creating cookie:
            var cookieOptions=new CookieOptions{
                IsEssential=true,
                Expires=DateTime.Now.AddDays(30)//cookie expires after 30 days
                };
                Response.Cookies.Append("buyerId",buyerId,cookieOptions);

                var basket=new Basket{
                        buyerId=buyerId
                };

                _context.Baskets.Add(basket);//ef start tracking this basket entity

                return basket;

        }
    }
}