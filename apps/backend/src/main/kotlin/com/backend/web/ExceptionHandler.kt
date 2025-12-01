package com.backend.web

import com.backend.utils.ErrorFormatter
import jakarta.servlet.http.HttpServletRequest
import jakarta.validation.ConstraintViolationException
import org.jooq.exception.DataAccessException
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.http.converter.HttpMessageNotReadableException
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.servlet.NoHandlerFoundException
import org.springframework.web.servlet.resource.NoResourceFoundException

@ControllerAdvice
class ExceptionHandler {
    private val logger: Logger = LoggerFactory.getLogger(this::class.java.name)

    private fun errorLog(request: HttpServletRequest, httpStatus: HttpStatus, ex: Throwable) {
        val errorMessage =
            when (ex) {
                is HttpStatusException -> ex.message ?: "Invalid request error"
                else -> ErrorFormatter.format(ex)
            }
        logger.error("[{} {}] {} => {}", httpStatus.value(), request.method, request.requestURI, errorMessage)
        logger.debug("[{} {}] {} => {}", httpStatus.value(), request.method, request.requestURI, errorMessage, ex)
    }

    @ExceptionHandler(
        ConstraintViolationException::class,
        MethodArgumentNotValidException::class,
        HttpMessageNotReadableException::class,
        DataIntegrityViolationException::class
    )
    fun handleBadRequest(ex: Exception, request: HttpServletRequest): ResponseEntity<String> {
        errorLog(request, HttpStatus.BAD_REQUEST, ex)
        return ResponseEntity.badRequest().body(ErrorFormatter.format(ex))
    }

    @ExceptionHandler(NoHandlerFoundException::class, NoResourceFoundException::class)
    fun handleNotFound(ex: Exception, request: HttpServletRequest): ResponseEntity<String> {
        errorLog(request, HttpStatus.NOT_FOUND, ex)
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ErrorFormatter.format(ex))
    }

    @ExceptionHandler
    fun handleAccumulatedErrors(ex: AccumulatedErrorsException, request: HttpServletRequest): ResponseEntity<Map<String, Any>> {
        ex.errors.forEach { errorDetail ->
            logger.error("[{} {}] {} => {}", HttpStatus.UNPROCESSABLE_ENTITY.value(), request.method, request.requestURI, errorDetail.errorMessage)
        }
        val body = mapOf("errors" to ex.errors, "totalElements" to ex.totalElements)
        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(body)
    }

    @ExceptionHandler
    fun handleHttpStatusException(ex: HttpStatusException, request: HttpServletRequest): ResponseEntity<String> {
        errorLog(request, ex.httpStatusCode, ex)
        return ResponseEntity.status(ex.httpStatusCode).body(ex.message ?: "Invalid request error")
    }

    @ExceptionHandler(DataAccessException::class, Exception::class)
    fun handleInternalServerError(ex: Exception, request: HttpServletRequest): ResponseEntity<String> {
        errorLog(request, HttpStatus.INTERNAL_SERVER_ERROR, ex)
        return ResponseEntity.internalServerError().body(ErrorFormatter.format(ex))
    }
}
