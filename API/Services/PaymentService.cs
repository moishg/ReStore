using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.EntityFrameworkCore.ChangeTracking.Internal;
using Microsoft.Extensions.Configuration;
using Stripe;

namespace API.Services
{
    public class PaymentService
    {
        private readonly IConfiguration _config;
        public PaymentService(IConfiguration config)
        {
            _config = config;
        }

        public async Task<PaymentIntent> CreateOrUpdatePaymentIntent(Basket basket)
        {
            StripeConfiguration.ApiKey = _config["StripeSettings:SecretKey"];
            var service = new PaymentIntentService();


            PaymentIntent paymentIntent = new PaymentIntent();
            long subtotal = basket.Items.Sum(item => item.Quantity * item.Product.Price);
            int deliveryFee = subtotal > 10000 ? 0 : 500;

            if (string.IsNullOrEmpty(basket.PaymentIntentId))
            {
                PaymentIntentCreateOptions options = new PaymentIntentCreateOptions
                {
                    Amount = subtotal + deliveryFee,
                    Currency = "usd",
                    PaymentMethodTypes = new List<string> { "card" }
                };

               
            }
            else
            {
                PaymentIntentUpdateOptions paymentIntentUpdateOptions = new PaymentIntentUpdateOptions()
                {
                    Amount = subtotal + deliveryFee
                };

                await service.UpdateAsync(basket.PaymentIntentId, paymentIntentUpdateOptions);
            }

            return paymentIntent;





        }
    }
}