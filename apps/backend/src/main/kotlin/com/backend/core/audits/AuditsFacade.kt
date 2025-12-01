package com.backend.core.audits

import com.fasterxml.jackson.databind.ObjectMapper
import org.jooq.JSONB
import org.springframework.cache.annotation.Cacheable
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional
import org.springframework.transaction.support.TransactionSynchronizationAdapter
import org.springframework.transaction.support.TransactionSynchronizationManager
import java.util.*

@Component
class AuditsFacade(private val auditsRepository: AuditsRepository, private val objectMapper: ObjectMapper) {
    @Transactional
    fun create(
        message: String,
        payload: Any?,
        result: Any?,
        userId: UUID?
    ) {
        TransactionSynchronizationManager.registerSynchronization(
            object : TransactionSynchronizationAdapter() {
                override fun afterCommit() {
                    val payloadJson = payload?.let { objectMapper.writeValueAsString(it) } ?: "{}"
                    val resultJson = result?.let { objectMapper.writeValueAsString(it) }

                    auditsRepository.create(message, JSONB.valueOf(payloadJson), resultJson?.let { JSONB.valueOf(it) }, userId)
                }
            }
        )
    }

    @Cacheable(sync = true, value = ["audits"], key = "#id")
    @Transactional(readOnly = true)
    fun find(id: java.util.UUID): Audit? {
        return auditsRepository.find(id)
    }

    @Transactional(readOnly = true)
    fun getAll(): List<Audit> {
        return auditsRepository.getAll()
    }
}
