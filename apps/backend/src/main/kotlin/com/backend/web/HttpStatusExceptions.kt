package com.backend.web

import org.springframework.http.HttpStatus

open class HttpStatusException(message: String, val httpStatusCode: HttpStatus) : Exception(message)

class ResourceNotFoundException(message: String) : HttpStatusException(message, HttpStatus.NOT_FOUND)

class UnauthorizedException(message: String) : HttpStatusException(message, HttpStatus.UNAUTHORIZED)

class BadRequestException(message: String) : HttpStatusException(message, HttpStatus.BAD_REQUEST)

class InvalidCredentialsException(message: String) : HttpStatusException(message, HttpStatus.BAD_REQUEST)

class ConflictException(message: String) : HttpStatusException(message, HttpStatus.CONFLICT)

class AccumulatedErrorsException(
    val errors: List<ErrorDetail>,
    val totalElements: Int
) : RuntimeException("failed with ${'$'}{errors.size} error(s)") {
    data class ErrorDetail(val index: Int, val value: Any, val errorMessage: String)
}
