package edu.uiuc.cs411.project.nba.stats.config;

import edu.uiuc.cs411.project.nba.stats.security.AuthEntryPointJwt;
import edu.uiuc.cs411.project.nba.stats.security.AuthTokenFilter;
import edu.uiuc.cs411.project.nba.stats.security.JwtUtils;
import edu.uiuc.cs411.project.nba.stats.security.UserDetailsServiceImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(
		// securedEnabled = true,
		// jsr250Enabled = true,
		prePostEnabled = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

	private final JwtUtils jwtUtils;
	private final AuthEntryPointJwt authEntryPointJwt;
	private final UserDetailsServiceImpl userDetailsService;

	public WebSecurityConfig(JwtUtils jwtUtils, AuthEntryPointJwt authEntryPointJwt, UserDetailsServiceImpl userDetailsService) {
		this.jwtUtils = jwtUtils;
		this.authEntryPointJwt = authEntryPointJwt;
		this.userDetailsService = userDetailsService;
	}

	@Bean
	public AuthTokenFilter authenticationJwtTokenFilter() {
		return new AuthTokenFilter(jwtUtils, userDetailsService);
	}

	@Override
	public void configure(AuthenticationManagerBuilder authenticationManagerBuilder) throws Exception {
		authenticationManagerBuilder.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());
	}

	@Bean
	@Override
	public AuthenticationManager authenticationManagerBean() throws Exception {
		return super.authenticationManagerBean();
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Override
	protected void configure(HttpSecurity http) throws Exception {

        String[] staticResources = new String[]{
				"/",
				"/*.css",
				"/*.html",
				"/*.jpg",
				"/*.js.map",
				"/*.js",
				"/fonts/**"
        };
		http.cors().and().csrf().disable()
			.exceptionHandling().authenticationEntryPoint(authEntryPointJwt).and()
			.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
			.authorizeRequests().antMatchers("/api/auth/**").permitAll()
			.antMatchers("/api/test/**").permitAll()
			.antMatchers(staticResources).permitAll()
			.anyRequest().authenticated();

		http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);
	}

}
