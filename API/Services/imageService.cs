using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Configuration;

namespace API.Services
{
    public class imageService
    {
        private readonly Cloudinary _cloudinary;
        public imageService(IConfiguration config)
        {
            Account acc = new Account(
                config["Cloudinary:CloudName"],
                config["Cloudinary:ApiKey"],
                config["Cloudinary:ApiSecret"]
            );
            
           
           
        //    PublicKey  async Task<ImageUploadResult> AddImage
    }
}