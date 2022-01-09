using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Net.NetworkInformation;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace API.RequestHelpers
{
    public class PagedList<T> : List<T>
    {
        public MetaData MetaData { get; set; }

        public PagedList(List<T> items,int count, int pageNumber,int pageSize)
        {
            MetaData =new MetaData{// metadata object
                TotalCount=count,
                PageSize=pageSize,
                CurrentPage=pageNumber,
                TotalPages=(int)Math.Ceiling(count/(double)pageSize)//calculation that give the correct total pages
            };

            AddRange(items);//adding the items to the current list 
        }

        public static async Task<PagedList<T>> ToPagedList(IQueryable<T> query,int pageNumber,int pageSize)
        {
            var count=await query.CountAsync();//executing against the db to get the excat count ;
            var items=await query.Skip((pageNumber=1)*pageSize).Take(pageSize).ToListAsync();//if pagesize=10 ,we skip 10 records to get the next 10 records                                                                                                              

            return new PagedList<T>(items,count,pageNumber,pageSize);
        }
    }
}