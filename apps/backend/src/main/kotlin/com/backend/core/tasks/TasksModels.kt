package com.backend.core.tasks

import com.backend.jooq.enums.TasksPriorityEnum
import com.backend.jooq.enums.TasksStatusEnum
import com.backend.jooq.tables.Tasks
import com.backend.jooq.tables.records.TasksRecord
import com.fasterxml.jackson.annotation.JsonInclude
import java.time.LocalDateTime
import java.util.*

data class Task(
    val id: UUID,
    val title: String,
    val description: String?,
    val status: TasksStatusEnum,
    val priority: TasksPriorityEnum,
    val assigneeId: UUID?,
    val deleted: Boolean,
    val createdAt: LocalDateTime,
    val modifiedAt: LocalDateTime
)

/** Converts a jOOQ record to a domain model. */
fun TasksRecord.toDto(): Task {
    return Task(
        id = this.id!!,
        title = this.title,
        description = this.description,
        status = this.status!!,
        priority = this.priority!!,
        assigneeId = this.assigneeId,
        deleted = this.deleted!!,
        createdAt = this.createdAt!!,
        modifiedAt = this.modifiedAt!!
    )
}

data class CreateTask(
    val title: String,
    val description: String? = null,
    val status: TasksStatusEnum = TasksStatusEnum.TODO,
    val priority: TasksPriorityEnum = TasksPriorityEnum.MEDIUM,
    val assigneeId: UUID? = null
)

/** Converts create payload to a jOOQ record for insertion. */
fun CreateTask.toRecord(): TasksRecord {
    return TasksRecord(
        title = this.title,
        description = this.description,
        status = this.status,
        priority = this.priority,
        assigneeId = this.assigneeId
    )
}

/** Type-safe filter for task queries. */
sealed class FindTask {
    data class ById(val id: UUID) : FindTask()
}

@JsonInclude(JsonInclude.Include.NON_NULL)
data class UpdateTask(
    val title: String? = null,
    val description: String? = null,
    val status: TasksStatusEnum? = null,
    val priority: TasksPriorityEnum? = null,
    val assigneeId: UUID? = null
)

/** Converts update payload to a jOOQ record with only changed fields. */
fun UpdateTask.toRecord(): TasksRecord {
    val record = Tasks.TASKS.newRecord()
    this.title?.let { record.title = it }
    this.description?.let { record.description = it }
    this.status?.let { record.status = it }
    this.priority?.let { record.priority = it }
    this.assigneeId?.let { record.assigneeId = it }
    return record
}
