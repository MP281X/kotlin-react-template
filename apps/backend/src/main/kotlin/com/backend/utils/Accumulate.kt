package com.backend.utils

import com.backend.web.AccumulatedErrorsException
import kotlinx.coroutines.async
import kotlinx.coroutines.awaitAll
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.runBlocking

fun <T, R> Iterable<T>.accumulateErrors(transform: (T) -> R): List<R> =
    runBlocking {
        coroutineScope {
            val rawInput = this@accumulateErrors.toList()

            val deferredResults =
                rawInput.mapIndexed { index, element ->
                    async {
                        try {
                            Result.success(transform(element))
                        } catch (t: Throwable) {
                            val errorMessage = t.message ?: t.javaClass.simpleName
                            Result.failure(t)
                        }
                    }
                }

            val results = mutableListOf<R>()
            val errors = mutableListOf<AccumulatedErrorsException.ErrorDetail>()
            var shouldBreak = false

            deferredResults.awaitAll().forEachIndexed { index, result ->
                when {
                    result.isSuccess -> results.add(result.getOrThrow())
                    result.isFailure -> {
                        val error = result.exceptionOrNull()!!
                        val errorMessage = error.message ?: error.javaClass.simpleName
                        errors.add(
                            AccumulatedErrorsException.ErrorDetail(
                                index = index + 1,
                                value = rawInput[index] as Any,
                                errorMessage = errorMessage
                            )
                        )
                        if (errorMessage.contains("current transaction is aborted")) {
                            shouldBreak = true
                            return@forEachIndexed
                        }
                    }
                }
            }

            if (shouldBreak) return@coroutineScope results

            if (errors.isNotEmpty()) {
                clearAllCaches()
                throw AccumulatedErrorsException(errors = errors, totalElements = rawInput.size)
            }
            results
        }
    }
