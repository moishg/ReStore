using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extentions;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Stripe;

namespace API.Controllers
{
    public class PaymentsController : BaseApiController
    {
        private readonly PaymentService _paymentService;
        private readonly StoreContext _context;
        public PaymentsController(PaymentService paymentService, StoreContext context)
        {
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

    }
}