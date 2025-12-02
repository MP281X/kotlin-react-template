package com.backend.core

import com.backend.utils.clearAllCaches
import com.zaxxer.hikari.HikariDataSource
import org.springframework.beans.factory.annotation.Value
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.client.RestTemplate

/** Resets application state for testing (clears caches, truncates tables, clears ElectricSQL shapes). */
@RestController
class CleanupController(
    private val dataSource: HikariDataSource,
    @param:Value("\${electric.url}") private val electricUrl: String?
) {
    @PostMapping("cleanup")
    fun cleanup(): Unit =
        with(JdbcTemplate(dataSource)) {
            // clean Cacheable annotation cache
            clearAllCaches()
            // truncate db tables (keep users table and flyway schema table)
            val tables = query("SELECT format('%I.%I', schemaname, tablename) AS table_name FROM pg_tables WHERE schemaname = 'public'") { rs, _ -> rs.getString("table_name") }
            execute("TRUNCATE TABLE ${tables.filter { it.lowercase() != "public.users" && it.lowercase() != "public.flyway_schema_history" }.joinToString(", ")} RESTART IDENTITY CASCADE")
            // delete electric shapes for truncated tables only
            electricUrl?.let { url -> tables.forEach { table -> runCatching { RestTemplate().delete("$url/v1/shape?table=${table.split(".").last()}") } } }
        }
}
