using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extentions;
using API.RequestHelpers;
using API.Services;
using AutoMapper;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SQLitePCL;

namespace API.Controllers
{
    public class ProductsController : BaseApiController
    {
        private readonly StoreContext _context;
        private readonly IMapper _mapper;
        private readonly ImageService _imageService;

        public ProductsController(StoreContext context, IMapper mapper, ImageService imageService)
        {
            _imageService = imageService;
            _mapper = mapper;
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<PagedList<Product>>> GetProducts([FromQuery] ProductParams productParams)
        {
            var query = _context.Products
            .Sort(productParams.OrderBy)
             .Search(productParams.SearchTerm)
            .Filter(productParams.Brands, productParams.Types)
            .AsQueryable();

            //var products2=query.ToList<Product>();

            var products = await PagedList<Product>.ToPagedList(query, productParams.PageNumber, productParams.PageSize);

            Response.AddPaginationHeader(products.MetaData);
            //Response.Headers.Add("Pagination",JsonSerializer.Serialize(products.MetaData));

            return products;
        }

        [HttpGet("{id}", Name = "GetProduct")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            Product product = await _context.Products.FindAsync(id);

            if (product == null)
                return NotFound();
            else
                return product;

        }

        [HttpGet("filters")]
        public async Task<IActionResult> GetFilters()
        {
            List<string> brands = await _context.Products.Select(p => p.Brand).Distinct().ToListAsync();
            List<string> types = await _context.Products.Select(p => p.Type).Distinct().ToListAsync();

            var returnVal = new { brands, types };
            return Ok(returnVal);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<Product>> CreateProduct([FromForm] CreateProductDto productDto)
        {
            Product product = _mapper.Map<Product>(productDto);
            if (productDto.File != null)
            {
                ImageUploadResult imageResult = await _imageService.AddImageAsync(productDto.File);
                if (imageResult.Error != null)
                {
                    return BadRequest(new ProblemDetails { Title = imageResult.Error.Message });
                }

                product.PictureUrl = imageResult.SecureUrl.ToString();
                product.PublicId = imageResult.PublicId;

            }

            _context.Products.Add(product);

            bool result = await _context.SaveChangesAsync() > 0;
            if (result)
            {
                return CreatedAtRoute("GetProduct", new { Id = product.Id }, product);//returinng the "product" object
            }
            else
            {
                return BadRequest(new ProblemDetails { Title = "Problem creating new product" });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPut]
        public async Task<ActionResult<Product>> UpdateProduct([FromForm] UpdateProductDto productDto)
        {
            Product product = await _context.Products.FindAsync(productDto.Id);

            if (product == null)
            {
                return NotFound();
            }

            _mapper.Map(productDto, product);

            if (productDto.File != null)
            {
                ImageUploadResult imageResult = await _imageService.AddImageAsync(productDto.File);
                if (imageResult.Error != null)
                {
                    return BadRequest(new ProblemDetails { Title = imageResult.Error.Message });
                }

                 //deleting  product image from cloud if exists
                if (string.IsNullOrWhiteSpace(product.PublicId) == false)
                {
                    await _imageService.DeleteImageAsync(product.PublicId);
                }

                product.PictureUrl = imageResult.SecureUrl.ToString();
                product.PublicId = imageResult.PublicId;
            }





            bool result = await _context.SaveChangesAsync() > 0;
            if (result)
            {
                return Ok(product);
            }
            else
            {
                return BadRequest(new ProblemDetails { Title = "Problem updating the  product" });
            }
        }


        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound();
            }

            //deleting  product image from cloud if exists
            if (string.IsNullOrWhiteSpace(product.PublicId) == false)
            {
                await _imageService.DeleteImageAsync(product.PublicId);
            }


            _context.Products.Remove(product);

            bool result = await _context.SaveChangesAsync() > 0;
            if (result)
            {
                return Ok();
            }
            else
            {
                return BadRequest(new ProblemDetails { Title = "Problem  deleting product" });
            }
        }
    }
}