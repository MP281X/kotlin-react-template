package com.backend.core.auth

import com.backend.core.users.User
import com.backend.jooq.enums.UsersRoleEnum
import jakarta.servlet.http.HttpSession
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import org.springframework.web.context.annotation.RequestScope
import java.time.Duration
import java.util.*

/** Holds authenticated user data stored in HTTP session. */
data class AuthSessionData(val userId: UUID, val email: String, val role: UsersRoleEnum?)

/** Provides request-scoped access to the current user's session data. */
@Component
@RequestScope
class AuthRequestContext {
    var userId: UUID? = null
    var email: String? = null
    var role: UsersRoleEnum? = null
}

/** Manages HTTP session lifecycle for authentication. */
@Component
class AuthSessionsManager(
    @param:Value("\${auth.sessions.ttl}") private var sessionTTL: Duration,
    private val authRequestContext: AuthRequestContext
) {
    fun create(data: User, session: HttpSession) {
        val sessionData = AuthSessionData(userId = data.id, email = data.email, role = data.role)
        session.setAttribute("sessionData", sessionData)
        session.maxInactiveInterval = sessionTTL.toSeconds().toInt()
    }

    fun get(session: HttpSession?): AuthSessionData? {
        val sessionData = session?.getAttribute("sessionData") as? AuthSessionData
        sessionData?.let {
            authRequestContext.userId = it.userId
            authRequestContext.email = it.email
            authRequestContext.role = it.role
        }
        return sessionData
    }

    fun delete(session: HttpSession) {
        session.invalidate()
    }
}
