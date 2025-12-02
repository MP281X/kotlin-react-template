package com.backend.utils

import com.github.benmanes.caffeine.cache.Caffeine
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.cache.CacheManager
import org.springframework.cache.annotation.EnableCaching
import org.springframework.cache.caffeine.CaffeineCacheManager
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.stereotype.Component

private lateinit var globalCacheManager: CacheManager

/** Injects the CacheManager into a global variable for use outside Spring context. */
@Component
private class GlobalCacheManagerInjector(cm: CacheManager) {
    init {
        globalCacheManager = cm
    }
}

/** Clears all Spring-managed caches (used during test cleanup or data reset). */
fun clearAllCaches() {
    if (!::globalCacheManager.isInitialized) return
    globalCacheManager.cacheNames.forEach { cacheName -> globalCacheManager.getCache(cacheName)?.clear() }
}

@Configuration
@EnableCaching
class CacheConfig {
    @Bean
    fun cacheManager(cacheProperties: CacheProperties): CacheManager {
        val cacheManager = CaffeineCacheManager()
        cacheManager.setCaffeine(Caffeine.from(cacheProperties.spec))
        cacheManager.setAllowNullValues(false)
        return cacheManager
    }
}

@Component
@ConfigurationProperties(prefix = "spring.cache.caffeine")
class CacheProperties {
    lateinit var spec: String
}
