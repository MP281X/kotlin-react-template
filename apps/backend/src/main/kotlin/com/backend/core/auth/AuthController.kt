package com.backend.core.auth

import com.backend.core.audits.Audited
import com.backend.core.users.FindUser
import com.backend.core.users.User
import com.backend.core.users.UsersFacade
import com.backend.web.InvalidCredentialsException
import com.backend.web.ResourceNotFoundException
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import jakarta.servlet.http.HttpSession
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestAttribute
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController
import java.util.*

@RestController
class AuthController(
    private val usersFacade: UsersFacade,
    private val sessionsManager: AuthSessionsManager,
    private val authRequestContext: AuthRequestContext,
) {
    data class LoginPayload(val email: String, val password: String)

    @PostMapping("login")
    @Audited(message = "user login attempt for email '#{#payload.email}'")
    fun login(request: HttpServletRequest, @RequestBody payload: LoginPayload): UUID {
        return try {
            val userData = usersFacade.find(FindUser.ByEmailAndPassword(payload.email, payload.password))
            val session = request.getSession(true)
            sessionsManager.create(userData, session)
            userData.id
        } catch (ex: Exception) {
            throw InvalidCredentialsException("Invalid email or password")
        }
    }

    @Secured
    @PostMapping("getCurrentUser")
    fun getCurrentUser(): User {
        return try {
            usersFacade.find(FindUser.ById(authRequestContext.userId!!))
        } catch (ex: Exception) {
            throw ResourceNotFoundException("User not found")
        }
    }

    @PostMapping("logout")
    fun logout(request: HttpServletRequest) {
        val session = request.getSession(false)
        if (session != null) sessionsManager.delete(session)
    }
}
