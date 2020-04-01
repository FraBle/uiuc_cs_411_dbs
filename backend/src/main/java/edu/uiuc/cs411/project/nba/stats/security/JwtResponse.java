package edu.uiuc.cs411.project.nba.stats.security;

public class JwtResponse {

	private final String token;
	private final String type = "Bearer";
	private final String username;
	private final String email;

	public JwtResponse(String token, String username, String email) {
		this.token = token;
		this.username = username;
		this.email = email;
	}

	public String getToken() {
		return token;
	}

	public String getType() {
		return type;
	}

	public String getUsername() {
		return username;
	}

	public String getEmail() {
		return email;
	}

}