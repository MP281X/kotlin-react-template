package com.backend.core.auth

import com.backend.jooq.enums.UsersRoleEnum
import com.backend.web.UnauthorizedException
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.stereotype.Component
import org.springframework.web.method.HandlerMethod
import org.springframework.web.servlet.HandlerInterceptor

/** Marks endpoints that require authentication, with optional role restrictions. */
@Target(AnnotationTarget.FUNCTION, AnnotationTarget.CLASS)
@Retention(AnnotationRetention.RUNTIME)
annotation class Secured(val roles: Array<UsersRoleEnum> = [])

/** Intercepts requests to enforce authentication and role-based access control. */
@Component
class AuthMiddleware(
    private val sessionsManager: AuthSessionsManager
) : HandlerInterceptor {
    override fun preHandle(request: HttpServletRequest, response: HttpServletResponse, handler: Any): Boolean {
        val handlerMethod = handler as? HandlerMethod
        if (handlerMethod == null) return true

        val securedAnnotation = handlerMethod.getMethodAnnotation(Secured::class.java) ?: handlerMethod.beanType.getAnnotation(Secured::class.java)
        if (securedAnnotation == null) return true

        val session = sessionsManager.get(request.getSession(false))
        if (session == null) throw UnauthorizedException("Session Not Found")

        val allowedRoles = securedAnnotation.roles
        if (allowedRoles.isEmpty() || session.role in allowedRoles) return true

        throw UnauthorizedException("Unauthorized")
    }
}
