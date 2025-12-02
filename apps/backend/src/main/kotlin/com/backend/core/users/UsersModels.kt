package com.backend.core.users

import com.backend.jooq.enums.UsersRoleEnum
import com.backend.jooq.tables.Users
import com.backend.jooq.tables.records.UsersRecord
import com.fasterxml.jackson.annotation.JsonInclude
import java.time.LocalDateTime
import java.util.*

data class User(
    val id: UUID,
    val email: String,
    val password: String,
    val role: UsersRoleEnum,
    val deleted: Boolean,
    val createdAt: LocalDateTime,
    val modifiedAt: LocalDateTime
)

/** Converts a jOOQ record to a domain model. */
fun UsersRecord.toDto(): User {
    return User(
        id = this.id!!,
        email = this.email,
        password = this.password,
        role = this.role!!,
        deleted = this.deleted!!,
        createdAt = this.createdAt!!,
        modifiedAt = this.modifiedAt!!
    )
}

data class CreateUser(
    val email: String,
    val password: String,
    val role: UsersRoleEnum
)

/** Converts create payload to a jOOQ record for insertion. */
fun CreateUser.toRecord(): UsersRecord {
    return UsersRecord(
        email = this.email,
        password = this.password,
        role = this.role
    )
}

/** Type-safe filter for user queries. */
sealed class FindUser {
    data class ById(val id: UUID) : FindUser()

    data class ByPrimaryKeys(val email: String) : FindUser()

    data class ByEmailAndPassword(val email: String, val password: String) : FindUser()
}

@JsonInclude(JsonInclude.Include.NON_NULL)
data class UpdateUser(
    val password: String? = null,
    val role: UsersRoleEnum? = null
)

/** Converts update payload to a jOOQ record with only changed fields. */
fun UpdateUser.toRecord(): UsersRecord {
    val record = Users.USERS.newRecord()
    this.password?.let { record.password = it }
    this.role?.let { record.role = it }
    return record
}
