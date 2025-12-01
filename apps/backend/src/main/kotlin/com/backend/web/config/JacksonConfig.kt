package com.backend.web.config

import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.core.JsonGenerator
import com.fasterxml.jackson.core.JsonParser
import com.fasterxml.jackson.databind.DeserializationContext
import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.databind.JsonDeserializer
import com.fasterxml.jackson.databind.JsonSerializer
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.SerializerProvider
import com.fasterxml.jackson.databind.module.SimpleModule
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer
import com.fasterxml.jackson.module.kotlin.KotlinModule
import org.jooq.JSONB
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Primary
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

@Configuration
class JacksonConfig {
    @Bean
    @Primary
    fun objectMapper(): ObjectMapper {
        val jsonbModule =
            SimpleModule()
                .addSerializer(JSONB::class.java, JsonbSerializer())
                .addDeserializer(JSONB::class.java, JsonbDeserializer())

        val dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSSSSS")
        val javaTimeModule =
            JavaTimeModule()
                .addSerializer(LocalDateTime::class.java, LocalDateTimeSerializer(dateTimeFormatter))
                .addDeserializer(LocalDateTime::class.java, LocalDateTimeDeserializer(dateTimeFormatter))

        val mapper =
            ObjectMapper()
                .registerModule(KotlinModule.Builder().build())
                .registerModule(javaTimeModule)
                .registerModule(jsonbModule)
                .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
                .configure(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT, true)
                .setSerializationInclusion(JsonInclude.Include.NON_NULL)

        mapper.registerModule(
            SimpleModule().apply {
                addDeserializer(String::class.java,
                    object : JsonDeserializer<String?>() {
                        override fun deserialize(p: JsonParser, ctxt: DeserializationContext): String? = p.valueAsString?.trim()?.ifBlank { null }
                    }
                )
            }
        )

        return mapper
    }
}

class JsonbSerializer : JsonSerializer<JSONB>() {
    override fun serialize(value: JSONB, gen: JsonGenerator, provider: SerializerProvider) {
        val stringValue = value.toString()
        gen.writeRawValue(stringValue)
    }
}

class JsonbDeserializer : JsonDeserializer<JSONB>() {
    override fun deserialize(p: JsonParser, ctxt: DeserializationContext): JSONB {
        val stringValue = p.text
        return JSONB.valueOf(stringValue)
    }
}
