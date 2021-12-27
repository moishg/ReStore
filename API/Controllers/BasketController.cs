using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class BasketController:BaseApiController
    {
        private readonly StoreContext _context;

        public BasketController(StoreContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<Basket>> GetBasket()
        {
            Basket basket= await _context.Baskets
                                .Include(i=>i.Items)//include the items information 
                                .ThenInclude(p=>p.Product)//include the product in the items
                                .FirstOrDefaultAsync(x=>x.buyerId==Request.Cookies["buyerId"]);

            return  basket;
        }
    }
}