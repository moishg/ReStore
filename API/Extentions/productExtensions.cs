using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR.Protocol;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;

namespace API.Extentions
{
    public static class productExtensions
    {

        public static IQueryable<Product> Sort(this IQueryable<Product> query, string orderBy)//extending the IQueryable<Product>
        {
            if (string.IsNullOrWhiteSpace(orderBy))
            {
                return query.OrderBy(p => p.Name);
            }

            query = orderBy switch
            {
                "price" => query.OrderBy(p => p.Price),
                "priceDesc" => query.OrderByDescending(p => p.Price),
                _ => query.OrderByDescending(p => p.Name),
            };
            return query;
        }

        public static IQueryable<Product> Search(this IQueryable<Product> query, string searchTerm)
        {
            if (string.IsNullOrEmpty(searchTerm))
                return query;

            var lowerCaseSearchTerm = searchTerm.Trim().ToLower();

            return query.Where(p => p.Name.ToLower().Contains(lowerCaseSearchTerm));

        }

        public static IQueryable<Product> Filter(this IQueryable<Product> query, string brands, string types)
        {
                var brandList=new List<string>();
                var typeList=new List<string>();

                if(!string.IsNullOrEmpty(brands))
                {
                    brandList.AddRange(brands.ToLower().Trim().Split(",").ToList());
                }

                if(!string.IsNullOrEmpty(types))
                {
                    typeList.AddRange(types.ToLower().Trim().Split(",").ToList());
                }

                query=query.Where(p=>brandList.Count==0 || brandList.Contains(p.Brand.ToLower()));
                query=query.Where(p=>typeList.Count==0 || typeList.Contains(p.Type.ToLower()));

                return query;
        }

    }
}