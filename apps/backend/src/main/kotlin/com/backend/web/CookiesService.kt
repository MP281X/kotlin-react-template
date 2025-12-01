package com.backend.web

import jakarta.servlet.http.Cookie
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.web.servlet.server.CookieSameSiteSupplier
import org.springframework.core.env.Environment
import org.springframework.http.ResponseCookie
import org.springframework.stereotype.Component
import java.time.Duration

@Component
class CookiesService(
    @param:Value("\${auth.sessions.ttl}") private var cookieTTL: Duration,
    private val environment: Environment
) {
    fun setCookie(res: HttpServletResponse, name: String, value: String) {
        val cookie =
            ResponseCookie
                .from(name, value)
                .path("/")
                .maxAge(cookieTTL)
                .httpOnly(true)
                .sameSite("Lax")
                .secure(true)
                .build()

        res.addHeader("Set-Cookie", cookie.toString())
    }

    fun getCookie(request: HttpServletRequest, cookieName: String): String? {
        return request.cookies?.find { it.name == cookieName }?.value
    }

    fun deleteCookie(res: HttpServletResponse, name: String) {
        val cookie =
            ResponseCookie
                .from(name, "")
                .path("/")
                .maxAge(Duration.ZERO)
                .httpOnly(true)
                .sameSite("Lax")
                .secure(true)
                .build()

        res.addHeader("Set-Cookie", cookie.toString())
    }
}
