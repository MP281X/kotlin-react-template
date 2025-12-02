package com.backend.web

import org.springframework.http.HttpStatus

open class HttpStatusException(message: String, val httpStatusCode: HttpStatus) : Exception(message)

class ResourceNotFoundException(message: String) : HttpStatusException(message, HttpStatus.NOT_FOUND)

class UnauthorizedException(message: String) : HttpStatusException(message, HttpStatus.UNAUTHORIZED)

class InvalidCredentialsException(message: String) : HttpStatusException(message, HttpStatus.BAD_REQUEST)
