package com.backend.core.audits

import com.backend.jooq.tables.records.AuditsRecord
import org.jooq.JSONB
import java.time.LocalDateTime
import java.util.*

data class Audit(
    val id: UUID,
    val message: String,
    val payload: JSONB?,
    val result: JSONB?,
    val userId: UUID?,
    val timestamp: LocalDateTime
)

/** Converts a jOOQ record to a domain model. */
fun AuditsRecord.toDto(): Audit {
    return Audit(
        id = this.id!!,
        message = this.message,
        payload = this.payload,
        result = this.result,
        userId = this.userId,
        timestamp = this.timestamp!!
    )
}

data class FindAudit(
    val id: UUID
)
