package com.backend.web

import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import org.springframework.web.servlet.HandlerInterceptor

/** Logs incoming HTTP requests when debug logging is enabled. */
@Component
class ApiLoggerMiddleware : HandlerInterceptor {
    override fun preHandle(request: HttpServletRequest, response: HttpServletResponse, handler: Any): Boolean {
        val logger = LoggerFactory.getLogger(handler.javaClass.name)
        val uri = request.requestURI.replace("/api", "")
        if (request.queryString.isNullOrBlank()) {
            logger.info("${request.method.uppercase()} $uri")
        } else {
            logger.info("${request.method.uppercase()} $uri?${request.queryString}")
        }
        return true
    }
}
