package com.backend.utils

import com.fasterxml.jackson.databind.JsonMappingException
import com.fasterxml.jackson.databind.exc.InvalidFormatException
import com.fasterxml.jackson.databind.exc.MismatchedInputException
import com.fasterxml.jackson.databind.exc.UnrecognizedPropertyException
import com.fasterxml.jackson.module.kotlin.MissingKotlinParameterException
import jakarta.validation.ConstraintViolationException
import org.jooq.exception.DataAccessException
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.http.converter.HttpMessageNotReadableException
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.servlet.NoHandlerFoundException
import org.springframework.web.servlet.resource.NoResourceFoundException

/** Converts exceptions into user-friendly error messages. */
object ErrorFormatter {
    /** Returns a human-readable message from various exception types. */
    fun format(err: Throwable): String {
        return when (err) {
            is ConstraintViolationException -> err.constraintViolations.joinToString(", ") { "${it.propertyPath.last()} ${it.message}" }
            is MethodArgumentNotValidException -> err.bindingResult.fieldErrors.joinToString { "${it.field} ${it.defaultMessage}" }
            is HttpMessageNotReadableException -> formatHttpMessageNotReadable(err)
            is DataAccessException -> err.message ?: "Data access error"
            is DataIntegrityViolationException -> err.rootCause?.message ?: err.message ?: "Data integrity violation"
            is NoHandlerFoundException, is NoResourceFoundException -> "Handler not found"
            else -> err.message ?: "Unknown error"
        }
    }

    private fun formatHttpMessageNotReadable(err: HttpMessageNotReadableException): String {
        val cause =
            generateSequence(err.cause) { it.cause }.filterIsInstance<JsonMappingException>().firstOrNull()
                ?: return err.message ?: "Invalid request body"

        return when (cause) {
            is MissingKotlinParameterException -> "Missing required field: ${cause.path.toJsonPath()}"
            is UnrecognizedPropertyException -> "Unrecognized field: ${cause.path.toJsonPath()}"
            is InvalidFormatException -> {
                val path = cause.path.toJsonPath()
                val expected = cause.targetType?.simpleName ?: "value"
                val value = cause.value?.toString()?.let { " (value: $it)" } ?: ""
                "Invalid format for $path: expected $expected$value"
            }
            is MismatchedInputException -> "Invalid type for ${cause.path.toJsonPath()}: expected ${cause.targetType?.simpleName ?: "value"}"
            else ->
                cause.path
                    .takeIf { it.isNotEmpty() }
                    ?.toJsonPath()
                    ?.let { "Invalid request body at: $it" } ?: cause.originalMessage ?: "Invalid request body"
        }
    }

    private fun List<JsonMappingException.Reference>.toJsonPath(): String {
        return joinToString(".") { it.fieldName ?: "[${it.index}]" }
    }
}
