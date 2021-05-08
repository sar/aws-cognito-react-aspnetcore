using AwsCognito.Api.Authentication;
using AwsCognito.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;

namespace AwsCognito.Api.Controllers
{
	[ApiController]
	[Authorize]
	[Route("[controller]")]
	public class WeatherForecastController : ControllerBase
	{
		private static readonly string[] Summaries =
		{
			"Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
		};

		private readonly ILogger<WeatherForecastController> _logger;
		private readonly IIdentityService _identityService;

		public WeatherForecastController(
			ILogger<WeatherForecastController> logger,
			IIdentityService identityService
			)
		{
			_logger = logger;
			_identityService = identityService;
		}

		[HttpGet]
		public IEnumerable<WeatherForecast> Get()
		{
			var user = _identityService.GetAuthenticatedUser();
			_logger.LogInformation($"User {user.Id} {user.Email} ask for weather");

			var rng = new Random();
			var result = Enumerable
				.Range(1, 5)
				.Select(index => new WeatherForecast
				{
					Date = DateTime.Now.AddDays(index),
					TemperatureC = rng.Next(-20, 55),
					Summary = Summaries[rng.Next(Summaries.Length)]
				})
				.ToArray();

			return result;
		}
	}
}
