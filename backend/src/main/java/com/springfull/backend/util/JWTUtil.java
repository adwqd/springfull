package com.springfull.backend.util;

import java.time.ZonedDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.SignatureException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.log4j.Log4j2;

@Component
@Log4j2
public class JWTUtil {
	
	@Value("${com.springfull.jwt.secret}")
	private String key;
	@Value("${com.springfull.jwt.refresh")
	private String refreshKey;
	public final static long ACCESS_TOKEN_VALIDATION_SECOND = 1000L*60*10;
	public final static long REFRESH_TOKEN_VALIDATION_SECOND = 1000L*60*60*72;
	public final static String AUTHORIZATION_HEADER = "Authorization";
	
	
	public String generateToken(String member_uuid, String nickname, String state) {
		log.info("aaa"+key);	
		
		//헤더
		Map<String, Object> headers = new HashMap<>();
		headers.put("typ", "JWT");
		headers.put("alg", "HS256");
		
		//페이로드
		Date now = new Date();
		Date expiration = new Date(now.getTime()+ ACCESS_TOKEN_VALIDATION_SECOND);
		
		String jwtStr = Jwts.builder()
				.setHeader(headers)
				.claim("member_uuid", member_uuid)
				.claim("name", nickname)
				.claim("state", state)
				.setIssuedAt(Date.from(ZonedDateTime.now().toInstant()))
				.setExpiration(expiration)
				.signWith(SignatureAlgorithm.HS256, key.getBytes())
				.compact();
		return jwtStr;
	}
	
	public String generateRefreshToken(String member_uuid) {
		log.info("aaa"+key);	
		
		//헤더
		Map<String, Object> headers = new HashMap<>();
		headers.put("typ", "JWT");
		headers.put("alg", "HS256");
		
		//페이로드
		Date now = new Date();
		Date expiration = new Date(now.getTime()+ REFRESH_TOKEN_VALIDATION_SECOND);
		
		String jwtStr = Jwts.builder()
				.setHeader(headers)
				.claim("member_uuid", member_uuid)
				.setIssuedAt(Date.from(ZonedDateTime.now().toInstant()))
				.setExpiration(expiration)
				.signWith(SignatureAlgorithm.HS256, refreshKey.getBytes())
				.compact();
		return jwtStr;
	}
	
	public boolean validateToken(String token){
		try {
			Jwts.parser()
			.setSigningKey(key.getBytes())
			.parseClaimsJws(token);
			return true;
		} catch (SignatureException e) {
			log.info("잘못된 서명입니다.");
		} catch (ExpiredJwtException e) {
			log.info("만료된 토큰입니다.");
		} catch (IllegalArgumentException | MalformedJwtException e) {
			log.info("잘못된 토큰입니다.");
		}				
		return false;
	}
	
	public boolean validateRefreshToken(String token){
		try {
			Jwts.parser()
			.setSigningKey(refreshKey.getBytes())
			.parseClaimsJws(token);
			return true;
		} catch (SignatureException e) {
			log.info("잘못된 서명입니다.");
		} catch (ExpiredJwtException e) {
			log.info("만료된 토큰입니다.");
		} catch (IllegalArgumentException | MalformedJwtException e) {
			log.info("잘못된 토큰입니다.");
		}				
		return false;
	}
	
	public String getUUID(String token) {
		return Jwts.parser()
				.setSigningKey(key.getBytes())
				.parseClaimsJws(token)
				.getBody().get("member_uuid").toString();
	}
	
	public String getRefreshUUID(String token) {
		return Jwts.parser()
				.setSigningKey(refreshKey.getBytes())
				.parseClaimsJws(token)
				.getBody().get("member_uuid").toString();
	}
	
	public String getName(String token) {
		return Jwts.parser()
				.setSigningKey(key.getBytes())
				.parseClaimsJws(token)
				.getBody().get("name").toString();
	}
	
	public String getState(String token) {
		return Jwts.parser()
				.setSigningKey(key.getBytes())
				.parseClaimsJws(token)
				.getBody().get("state").toString();
	}
	
	public String getAccessToken(HttpServletRequest httpServletRequest) {
		String bearerToken = httpServletRequest.getHeader(AUTHORIZATION_HEADER);
		if(StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer")) {
			return bearerToken.substring(7);
		} else {
			return null;
		}
		
	}
	
	public String getRefreshToken(HttpServletRequest httpServletRequest) {
		String bearerToken = httpServletRequest.getHeader(AUTHORIZATION_HEADER);
		if(StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer")) {
			return bearerToken.substring(7);
		} else {
			return null;
		}
		
	}
	
	public String determineRedirectURI(HttpServletRequest httpServletRequest, String memberURI, String nonMemberURI) {
		String token = getAccessToken(httpServletRequest);
		if(token ==null) {
			return nonMemberURI;
		}else {
			return memberURI;
		}
	}
}
