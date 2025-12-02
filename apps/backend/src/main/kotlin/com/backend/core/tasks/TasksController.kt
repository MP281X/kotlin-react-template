package com.backend.core.tasks

import com.backend.core.auth.Secured
import com.backend.utils.ElectricShapeProxy
import com.fasterxml.jackson.annotation.JsonUnwrapped
import jakarta.validation.Valid
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import java.util.*

@Secured
@RestController
@Validated
class TasksController(private val tasksFacade: TasksFacade, private val electricShapeProxy: ElectricShapeProxy) {
    data class CreateTaskPayload(@field:JsonUnwrapped val data: CreateTask)

    @PostMapping("createTask")
    fun createTask(@Valid @RequestBody payload: CreateTaskPayload) = tasksFacade.create(payload.data)

    data class FindTaskPayload(@field:JsonUnwrapped val filter: FindTask.ById)

    @PostMapping("findTask")
    fun findTask(@Valid @RequestBody payload: FindTaskPayload) = tasksFacade.find(payload.filter)

    @PostMapping("getAllTasks")
    fun getAllTasks() = tasksFacade.getAll()

    @GetMapping("syncTasks")
    fun syncTasks(@RequestParam params: Map<String, String>) = electricShapeProxy.streamTable("tasks", params)

    data class UpdateTaskPayload(val id: UUID, @field:JsonUnwrapped val data: UpdateTask)

    @PostMapping("updateTask")
    fun updateTask(@Valid @RequestBody payload: UpdateTaskPayload) = tasksFacade.update(payload.id, payload.data)

    data class DeleteTaskPayload(val id: UUID)

    @PostMapping("deleteTask")
    fun deleteTask(@Valid @RequestBody payload: DeleteTaskPayload) = tasksFacade.delete(payload.id)
}
