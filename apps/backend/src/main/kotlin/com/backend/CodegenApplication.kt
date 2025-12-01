package com.backend

import com.zaxxer.hikari.HikariDataSource
import org.flywaydb.core.Flyway
import org.jooq.DSLContext
import org.jooq.SQLDialect
import org.jooq.impl.DSL
import org.springframework.boot.CommandLineRunner
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean
import org.springframework.boot.autoconfigure.flyway.FlywayAutoConfiguration
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration
import org.springframework.boot.autoconfigure.jooq.JooqAutoConfiguration
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Profile
import java.io.File
import java.net.URI
import kotlin.system.exitProcess

@SpringBootApplication(
    exclude = [DataSourceAutoConfiguration::class, HibernateJpaAutoConfiguration::class, FlywayAutoConfiguration::class, SecurityAutoConfiguration::class, JooqAutoConfiguration::class]
)
@Profile("codegen")
class CodegenApplication : CommandLineRunner {
    @Bean
    @ConditionalOnMissingBean(Flyway::class)
    fun mockFlyway(): Flyway {
        return Flyway.configure().load().apply {}
    }

    @Bean
    @ConditionalOnMissingBean(HikariDataSource::class)
    fun mockHikariDataSource(): HikariDataSource {
        return HikariDataSource()
    }

    @Bean
    @ConditionalOnMissingBean(DSLContext::class)
    fun mockDSLContext(): DSLContext {
        return DSL.using(SQLDialect.H2)
    }

    override fun run(vararg args: String?) {
        println("Codegen application started, waiting for server to be ready...")
        Thread.sleep(1000)
        try {
            File("target").mkdirs()
            File("target/openapi.json").writeText(URI.create("http://localhost:8081/api/v3/api-docs").toURL().readText())
            println("OpenAPI spec generated successfully!")
        } catch (e: Exception) {
            println("Error generating OpenAPI spec: ${e.message}")
            e.printStackTrace()
        }
        exitProcess(0)
    }
}

fun main(args: Array<String>) {
    System.setProperty("spring.profiles.active", "codegen")
    runApplication<CodegenApplication>(*args)
}
