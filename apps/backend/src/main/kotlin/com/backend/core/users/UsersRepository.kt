package com.backend.core.users

import com.backend.core.audits.Audited
import com.backend.jooq.tables.Users.Companion.USERS
import com.backend.web.ResourceNotFoundException
import org.jooq.DSLContext
import org.jooq.impl.DSL
import org.springframework.stereotype.Component
import java.time.LocalDateTime
import java.util.*

@Component
class UsersRepository(
    private val dsl: DSLContext,
) {
    @Audited(message = "created user '#{#data.email}' with role '#{#data.role}'")
    fun create(data: CreateUser): UUID {
        return dsl
            .insertInto(USERS)
            .set(data.toRecord())
            .returning()
            .fetchOne { it.id }!!
    }

    fun findById(filter: FindUser.ById): User {
        return dsl
            .selectFrom(USERS)
            .where(USERS.id.eq(filter.id))
            .and(USERS.deleted.isFalse)
            .fetchOne { it.toDto() }
            ?: throw ResourceNotFoundException("user not found: $filter")
    }

    fun findByPrimaryKeys(filter: FindUser.ByPrimaryKeys): User {
        return dsl
            .selectFrom(USERS)
            .where(DSL.upper(USERS.email).eq(filter.email.uppercase()))
            .and(USERS.deleted.isFalse)
            .fetchOne { it.toDto() }
            ?: throw ResourceNotFoundException("user not found: $filter")
    }

    fun findByEmailAndPassword(filter: FindUser.ByEmailAndPassword): User {
        return dsl
            .selectFrom(USERS)
            .where(DSL.upper(USERS.email).eq(filter.email.uppercase()))
            .and(USERS.deleted.isFalse)
            .fetchOne { it.toDto() }
            ?: throw ResourceNotFoundException("user not found: $filter")
    }

    fun getAll(): List<User> {
        return dsl
            .selectFrom(USERS)
            .orderBy(USERS.email.asc())
            .fetch { it.toDto() }
    }

    @Audited(message = "updated user '#{#id}'")
    fun update(
        id: UUID,
        data: UpdateUser,
    ) {
        val updatedRows =
            dsl
                .update(USERS)
                .set(USERS.modifiedAt, LocalDateTime.now())
                .set(data.toRecord())
                .where(USERS.id.eq(id))
                .and(USERS.deleted.isFalse)
                .execute()

        if (updatedRows != 1) throw ResourceNotFoundException("user '$id' not found")
    }

    @Audited(message = "deleted user '#{#id}'")
    fun delete(id: UUID) {
        val updatedRows =
            dsl
                .update(USERS)
                .set(USERS.deleted, true)
                .set(USERS.modifiedAt, LocalDateTime.now())
                .where(USERS.id.eq(id))
                .and(USERS.deleted.isFalse)
                .execute()

        if (updatedRows != 1) throw ResourceNotFoundException("user '$id' not found")
    }
}
