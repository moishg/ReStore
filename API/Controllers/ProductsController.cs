using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{    
    public class ProductsController:BaseApiController
    {
        private readonly StoreContext _context;
        
        public ProductsController(StoreContext context)
        {
            _context = context;
         
        }

        [HttpGet]
        public async Task<ActionResult <List<Product>>> GetProducts()
        {
            var products= await _context.Products.ToListAsync();
            return Ok(products);//200 response type
        }

        [HttpGet("{id}")]        
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            Product product= await _context.Products.FindAsync(id);
            
            if(product==null)
                return NotFound();
            else 
                return product;

        }
    }
}