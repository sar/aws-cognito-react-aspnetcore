namespace AwsCognito.Api.Authentication
{
	public class AuthenticatedUserModel
	{
		public string Id { get; set; }
		public string Email { get; set; }
		public string Name { get; set; }
		public bool IsEmailVerified { get; set; }
	}
}
