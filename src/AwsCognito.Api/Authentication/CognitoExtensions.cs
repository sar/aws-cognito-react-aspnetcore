using AwsCognito.Api.Configs;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.Net;

namespace AwsCognito.Api.Authentication
{
	public static class CognitoExtensions
	{

		public static void AddCognitoAuthentication(this IServiceCollection services, IConfiguration configuration)
		{
			var cognitoConfig = configuration.GetSection(nameof(CognitoConfig)).Get<CognitoConfig>();
			var clientId = cognitoConfig.AppClientId;
			var regionId = cognitoConfig.RegionId;
			var configPoolId = cognitoConfig.PoolId;

			services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
				.AddJwtBearer(options =>
				{
					options.TokenValidationParameters = new TokenValidationParameters
					{
						IssuerSigningKeyResolver = (s, securityToken, identifier, parameters) =>
						{
							// get JsonWebKeySet from AWS
							var json = new WebClient().DownloadString(parameters.ValidIssuer + "/.well-known/jwks.json");

							// serialize the result
							var keys = new JsonWebKeySet(json).GetSigningKeys();

							// cast the result to be the type expected by IssuerSigningKeyResolver
							return keys;
						},

						ValidIssuer = $"https://cognito-idp.{regionId}.amazonaws.com/{configPoolId}",
						ValidateIssuerSigningKey = true,
						ValidateIssuer = true,
						ValidateLifetime = true,
						ValidAudience = clientId,
						ValidateAudience = true
					};
				});
		}
	}
}
