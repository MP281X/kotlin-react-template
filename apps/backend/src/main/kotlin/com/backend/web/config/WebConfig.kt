package com.backend.web.config

import com.backend.core.auth.AuthMiddleware
import com.backend.web.ApiLoggerMiddleware
import org.slf4j.LoggerFactory
import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.InterceptorRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

/** Registers middleware for API logging (debug only) and authentication. */
@Configuration
class WebConfig(
    private val apiLoggerMiddleware: ApiLoggerMiddleware,
    private val authMiddleware: AuthMiddleware,
) : WebMvcConfigurer {
    val isDebugEnabled = LoggerFactory.getLogger(ApiLoggerMiddleware::class.java).isDebugEnabled

    override fun addInterceptors(registry: InterceptorRegistry) {
        if (isDebugEnabled) registry.addInterceptor(apiLoggerMiddleware).addPathPatterns("/**")
        registry.addInterceptor(authMiddleware).addPathPatterns("/**")
    }
}
