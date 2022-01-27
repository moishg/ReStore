using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [AllowAnonymous]
    public class FallbackController : Controller
    {
        public IActionResult Index()
        {
            //string indexFileLocation = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "index.html");

            var parentDir=Directory.GetParent(Directory.GetCurrentDirectory());
            string indexFileLocation = Path.Combine(parentDir.FullName ,"client", "build", "index.html");


            return PhysicalFile(indexFileLocation, "text/HTML");

        }
    }
}