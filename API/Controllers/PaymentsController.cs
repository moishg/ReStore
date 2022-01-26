using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text.Json.Serialization.Metadata;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Entities.OrderAggregate;
using API.Extentions;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Stripe;

namespace API.Controllers
{
    public class PaymentsController : BaseApiController
    {
        private readonly PaymentService _paymentService;
        private readonly StoreContext _context;
        private readonly IConfiguration _config;
        public PaymentsController(PaymentService paymentService, StoreContext context, IConfiguration config)
        {
            _config = config;
            _context = context;
            _paymentService = paymentService;
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<BasketDto>> CreateOrUpdatePaymentIntent()
        {
            BasketDto basketResult = new BasketDto();
            Basket basket = await _context.Baskets.RetrieveBasketWithItems(User.Identity.Name).FirstOrDefaultAsync();
            if (basket == null)
            {
                return NotFound();
            }

            PaymentIntent paymentIntent = await _paymentService.CreateOrUpdatePaymentIntent(basket);
            if (paymentIntent == null)
                return BadRequest(new ProblemDetails { Title = "Problem creating payment intent" });


            basket.PaymentIntentId = basket.PaymentIntentId ?? paymentIntent.Id;
            basket.ClientSecret = basket.ClientSecret ?? paymentIntent.ClientSecret;

            _context.Update(basket);

            bool isSaved = await _context.SaveChangesAsync() > 0;
            if (isSaved == false)
            {
                ProblemDetails problemDetails = new ProblemDetails
                {
                    Title = "Problem updating basket with intent"
                };

                return BadRequest(problemDetails);
            }

            basketResult = basket.MapBasketToDto();

            return basketResult;
        }

        [HttpPost("webhook")]
        public async Task<ActionResult> StripeWebhook()
        {
            string json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();

            var stripeEvent = EventUtility.ConstructEvent(json, Request.Headers["Stripe-Signature"],
            _config["StripeSettings:WhSecret"],throwOnApiVersionMismatch:false);

            Charge charge = (Charge)stripeEvent.Data.Object;

            Entities.OrderAggregate.Order order = await _context.Orders.
                                                FirstOrDefaultAsync(x => x.PaymentIntentId == charge.PaymentIntentId);

            if (charge.Status == "succeeded")
            {
                order.OrderStatus = OrderStatus.paymentReceived;
            }

            await _context.SaveChangesAsync();

            return new EmptyResult();//to inform the stripe we received the request
        }
    }
}