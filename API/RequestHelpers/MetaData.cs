using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.RequestHelpers
{
    public class MetaData//class information about the pagination ,to be displayed in the user intraface
    {
        public int CurrentPage{get;set;}//the current pages

        public int TotalPages{get;set;}//how many pages in total

        public int PageSize{get;set;}//

        public int TotalCount{get;set;}//total count of items in the list ,before the pagination
    }
}