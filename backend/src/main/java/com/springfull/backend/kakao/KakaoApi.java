package com.springfull.backend.kakao;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;
import java.util.HashMap;

import org.springframework.stereotype.Service;

import com.nimbusds.jose.shaded.gson.JsonElement;
import com.nimbusds.jose.shaded.gson.JsonObject;
import com.nimbusds.jose.shaded.gson.JsonParser;

import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
public class KakaoApi {
	private String kakaoApiKey = "f9b961caf76caffaab08ed1e2ce895cb";

	private String kakaoRedirectUri = "http://localhost:5173/oauth/kakao/callback";
    
    //인가 코드를 받아서 accessToken을 반환
	public String getAccessToken(String code){
		String accessToken = "";
	    String refreshToken = "";
	    String reqUrl = "https://kauth.kakao.com/oauth/token";

	    try{
	        URL url = (new URI(reqUrl)).toURL();
	        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
	        
	        //필수 헤더 세팅
	        conn.setRequestProperty("Content-type", "application/x-www-form-urlencoded;charset=utf-8");
	        conn.setDoOutput(true); //OutputStream으로 POST 데이터를 넘겨주겠다는 옵션.

	        BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(conn.getOutputStream()));
	        StringBuilder sb = new StringBuilder();
	        
	        //필수 쿼리 파라미터 세팅
	        sb.append("grant_type=authorization_code");
	        sb.append("&client_id=").append(kakaoApiKey);
	        sb.append("&redirect_uri=").append(kakaoRedirectUri);
	        sb.append("&code=").append(code);

	        bw.write(sb.toString());
	        bw.flush();

	        int responseCode = conn.getResponseCode();
	        log.info("[KakaoApi.getAccessToken] responseCode = {}", responseCode);
	        

	        BufferedReader br;
	        if (responseCode >= 200 && responseCode < 300) {
	            br = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));
	        } else {
	            br = new BufferedReader(new InputStreamReader(conn.getErrorStream(), "UTF-8"));
	        }

	        String line = "";
	        StringBuilder responseSb = new StringBuilder();
	        while((line = br.readLine()) != null){
	            responseSb.append(line);
	        }
	        String result = responseSb.toString();
	        log.info("responseBody = {}", result);

	        JsonElement element = JsonParser.parseString(result);
	        accessToken = element.getAsJsonObject().get("access_token").getAsString();
	        refreshToken = element.getAsJsonObject().get("refresh_token").getAsString();
	        

	        br.close();
	        bw.close();
	    }catch (Exception e){
	        e.printStackTrace();
	    }
	    return accessToken;
	}
    //accessToken을 받아서 UserInfo 반환
	public HashMap<String, Object> getUserInfo(String accessToken) {
		HashMap<String, Object> userInfo = new HashMap<>();
	    String reqUrl = "https://kapi.kakao.com/v2/user/me";
	    try{
	        URL url = (new URI(reqUrl)).toURL();
	        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
	        conn.setRequestMethod("POST");
	        conn.setRequestProperty("Authorization", "Bearer " + accessToken);
	        conn.setRequestProperty("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

	        int responseCode = conn.getResponseCode();
	        log.info("[KakaoApi.getUserInfo] responseCode : {}",  responseCode);

	        BufferedReader br;
	        if (responseCode >= 200 && responseCode <= 300) {
	            br = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));
	        } else {
	            br = new BufferedReader(new InputStreamReader(conn.getErrorStream(), "UTF-8"));
	        }

	        String line = "";
	        StringBuilder responseSb = new StringBuilder();
	        while((line = br.readLine()) != null){
	            responseSb.append(line);
	        }
	        String result = responseSb.toString();
	        log.info("responseBody = {}", result);

	        JsonElement element = JsonParser.parseString(result);

	        JsonObject properties = element.getAsJsonObject().get("properties").getAsJsonObject();
	        JsonObject kakaoAccount = element.getAsJsonObject().get("kakao_account").getAsJsonObject();

	        String nickname = properties.getAsJsonObject().get("nickname").getAsString();
	        String profile = properties.getAsJsonObject().get("profile_image").getAsString();
	        String id = element.getAsJsonObject().get("id").getAsString();
	        System.out.println("id는 "+id);
	        System.out.println("프로필 주소는 "+profile);
	        //String email = kakaoAccount.getAsJsonObject().get("email").getAsString();
	        log.info(kakaoAccount);
	        userInfo.put("profile", profile);
	        userInfo.put("nickname", nickname);
	        userInfo.put("id", id);
	        
	        
	        //userInfo.put("email", email);

	        br.close();

	    }catch (Exception e){
	        e.printStackTrace();
	    }
	    return userInfo;
	}
    //accessToken을 받아서 로그아웃 시키는 메서드
	public void kakaoLogout(String accessToken) {
	
	}
}
