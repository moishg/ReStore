using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    [Table("BasketItems")]
    public class BasketItem
    {
        public int Id { get; set; }
        public int Quantity { get; set; }

        //navigation properties
        //basketItemId-ProductId===>1:1
        public int ProductId{get;set;}
        public Product Product { get; set; }

        //basketItemId-BasketId===>1:1
        public int BasketId{get;set;}
        public Basket Basket { get; set; }






    }
}