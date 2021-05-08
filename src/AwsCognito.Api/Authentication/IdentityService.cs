using Microsoft.AspNetCore.Http;
using System;
using System.Security.Authentication;
using System.Security.Claims;

namespace AwsCognito.Api.Authentication
{
	public interface IIdentityService
	{
		AuthenticatedUserModel GetAuthenticatedUser();
	}

	public static class CustomClaimTypes
	{
		public const string Name = "name";
		public const string EmailVerified = "email_verified";
	}

	public class IdentityService : IIdentityService
	{
		private readonly IHttpContextAccessor _httpContextAccessor;

		public IdentityService(
			IHttpContextAccessor httpContextAccessor
			) => _httpContextAccessor = httpContextAccessor;

		public AuthenticatedUserModel GetAuthenticatedUser()
		{
			var httpContext = _httpContextAccessor.HttpContext;
			if (httpContext == null)
			{
				throw new AuthenticationException($"Invalid {nameof(_httpContextAccessor.HttpContext)} for user");
			}

			var user = GetUserFromClaimsPrincipal(httpContext.User);
			return user;
		}

		public AuthenticatedUserModel GetUserFromClaimsPrincipal(ClaimsPrincipal cp)
		{
			if (cp.Identity is ClaimsIdentity identity)
			{
				var emailVerified = identity.FindFirst(CustomClaimTypes.EmailVerified).Value;

				var user = new AuthenticatedUserModel
				{
					Id = identity.FindFirst(ClaimTypes.NameIdentifier).Value,
					Email = identity.FindFirst(ClaimTypes.Email).Value,
					Name = identity.FindFirst(CustomClaimTypes.Name).Value,
					IsEmailVerified = string.Equals(emailVerified, "true", StringComparison.InvariantCultureIgnoreCase),
				};

				return user;
			}

			throw new AuthenticationException($"Invalid {nameof(ClaimsPrincipal)} for user");
		}

	}
}
