using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Entities.OrderAggregate;
using API.Extentions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SQLitePCL;

namespace API.Controllers
{

    [Authorize]
    public class OrdersController : BaseApiController
    {

        public StoreContext _context { get; }

        public OrdersController(StoreContext context)
        {
            _context = context;

        }

        [HttpGet]
        public async Task<ActionResult<List<OrderDto>>> GetOrders()
        {
            List<OrderDto> result = await _context.Orders
            .ProjectOrderToOrderDto()
            .Where(x => x.BuyerId == User.Identity.Name).ToListAsync();

            return result;
        }

        [HttpGet("{id}", Name = "GetOrder")]
        public async Task<ActionResult<Order>> GetOrder(int id)
        {
            Order result = await _context.Orders
              .Include(o => o.OrderItems)
              .Where(x => x.BuyerId == User.Identity.Name && x.Id == id).FirstOrDefaultAsync();

            return result;

        }

        [HttpPost]
        public async Task<ActionResult<int>> CreateOrder(CreateOrderDto orderDto)
        {
            Basket basket = await _context.Baskets
            .RetrieveBasketWithItems(User.Identity.Name).FirstOrDefaultAsync();

            if (basket == null)
            {
                return BadRequest(new ProblemDetails { Title = "Could not locate basket" });
            }
            else
            {
                List<OrderItem> items = new List<OrderItem>();

                foreach (var item in basket.Items)
                {
                    Product productItem = await _context.Products.FindAsync(item.ProductId);

                    ProductItemOrdered itemOrdered = new ProductItemOrdered
                    {
                        ProductId = productItem.Id,
                        Name = productItem.Name,
                        PictureUrl = productItem.PictureUrl
                    };

                    OrderItem orderItem = new OrderItem
                    {
                        ItemOrdered = itemOrdered,
                        Price = productItem.Price,
                        Quantity = item.Quantity
                    };

                    items.Add(orderItem);

                    productItem.QuantityInStock -= item.Quantity;

                }

                long subTotal = items.Sum(item => item.Price * item.Quantity);
                long deliveryFee = subTotal > 10000 ? 0 : 500;

                Order order = new Order
                {
                    OrderItems = items,
                    BuyerId = User.Identity.Name,
                    ShippingAddress = orderDto.ShippingAddress,
                    Subtotal = subTotal,
                    DeliveryFee = deliveryFee
                };

                _context.Orders.Add(order);
                _context.Baskets.Remove(basket);

                if (orderDto.SaveAddress)//updating the user address
                {
                    User user = await _context.Users.FirstOrDefaultAsync(x => x.UserName == User.Identity.Name);
                    user.Address = new UserAddress
                    {
                        FullName = orderDto.ShippingAddress.FullName,
                        Address1 = orderDto.ShippingAddress.Address1,
                        Address2 = orderDto.ShippingAddress.Address2,
                        City = orderDto.ShippingAddress.City,
                        State = orderDto.ShippingAddress.State,
                        Zip = orderDto.ShippingAddress.Zip,
                        Country = orderDto.ShippingAddress.Country
                    };
                    _context.Update(user);
                }


                bool result = await _context.SaveChangesAsync() > 0;
                if (result)
                {
                    return CreatedAtRoute("GetOrder", new { id = order.Id }, order.Id);
                }
                else
                {// if the "result" is "false"
                    return BadRequest("Problem creating order ");
                }



            }

        }

    }
}