using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.NetworkInformation;
using System.Runtime.InteropServices;
using System.Threading.Tasks;

namespace API.RequestHelpers
{
    public class PagedList<T> : List<T>
    {
        public MetaData MetaData { get; set; }

        public PagedList(List<T> items,int count, int pageNumber,int pageSize)
        {
            MetaData =new MetaData{
                TotalCount=count,
                PageSize=pageSize,
                CurrentPage=pageNumber,
                TotalPages=(int)Math.Ceiling(count/(double)pageSize)//calculation that give the correct total pages
            };

            AddRange(items);
        }

       // public static async Task<PagedList<T>
    }
}