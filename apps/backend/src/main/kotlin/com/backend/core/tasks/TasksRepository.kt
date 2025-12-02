package com.backend.core.tasks

import com.backend.core.audits.Audited
import com.backend.jooq.tables.Tasks.Companion.TASKS
import com.backend.web.ResourceNotFoundException
import org.jooq.DSLContext
import org.springframework.stereotype.Component
import java.time.LocalDateTime
import java.util.*

@Component
class TasksRepository(
    private val dsl: DSLContext,
) {
    @Audited(message = "created task '#{#data.title}'")
    fun create(data: CreateTask): UUID {
        return dsl
            .insertInto(TASKS)
            .set(data.toRecord())
            .returning()
            .fetchOne { it.id }!!
    }

    fun findById(filter: FindTask.ById): Task {
        return dsl
            .selectFrom(TASKS)
            .where(TASKS.id.eq(filter.id))
            .and(TASKS.deleted.isFalse)
            .fetchOne { it.toDto() }
            ?: throw ResourceNotFoundException("task not found: $filter")
    }

    fun getAll(): List<Task> {
        return dsl
            .selectFrom(TASKS)
            .where(TASKS.deleted.isFalse)
            .orderBy(TASKS.createdAt.desc())
            .fetch { it.toDto() }
    }

    @Audited(message = "updated task '#{#id}'")
    fun update(
        id: UUID,
        data: UpdateTask,
    ) {
        val updatedRows =
            dsl
                .update(TASKS)
                .set(TASKS.modifiedAt, LocalDateTime.now())
                .set(data.toRecord())
                .where(TASKS.id.eq(id))
                .and(TASKS.deleted.isFalse)
                .execute()

        if (updatedRows != 1) throw ResourceNotFoundException("task '$id' not found")
    }

    /** Soft-deletes a task by setting deleted flag (preserves audit trail). */
    @Audited(message = "deleted task '#{#id}'")
    fun delete(id: UUID) {
        val updatedRows =
            dsl
                .update(TASKS)
                .set(TASKS.deleted, true)
                .set(TASKS.modifiedAt, LocalDateTime.now())
                .where(TASKS.id.eq(id))
                .and(TASKS.deleted.isFalse)
                .execute()

        if (updatedRows != 1) throw ResourceNotFoundException("task '$id' not found")
    }
}
