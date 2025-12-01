package com.backend.core.audits

import com.backend.jooq.tables.Audits.Companion.AUDITS
import org.jooq.DSLContext
import org.jooq.JSONB
import org.springframework.stereotype.Component

@Component
class AuditsRepository(
    private val dsl: DSLContext,
) {
    fun create(
        message: String,
        payload: JSONB,
        result: JSONB?,
        userId: java.util.UUID?
    ) {
        dsl
            .insertInto(AUDITS)
            .set(AUDITS.message, message)
            .set(AUDITS.payload, payload)
            .set(AUDITS.result, result)
            .set(AUDITS.userId, userId)
            .execute()
    }

    fun find(id: java.util.UUID): Audit? {
        return dsl
            .selectFrom(AUDITS)
            .where(AUDITS.id.eq(id))
            .fetchOne { it.toDto() }
    }

    fun getAll(): List<Audit> {
        return dsl
            .selectFrom(AUDITS)
            .orderBy(AUDITS.timestamp.desc())
            .fetch { it.toDto() }
    }
}
