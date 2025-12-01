package com.backend.core.users

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
class UsersController(private val usersFacade: UsersFacade, private val electricShapeProxy: ElectricShapeProxy) {
    data class CreateUserPayload(@field:JsonUnwrapped val data: CreateUser)

    @PostMapping("createUser")
    fun createUser(@Valid @RequestBody payload: CreateUserPayload) = usersFacade.create(payload.data)

    data class UpsertUserPayload(@field:JsonUnwrapped val data: CreateUser)

    @PostMapping("upsertUser")
    fun upsertUser(@Valid @RequestBody payload: UpsertUserPayload) = usersFacade.upsert(payload.data)

    data class FindUserPayload(@field:JsonUnwrapped val filter: FindUser.ById)

    @PostMapping("findUser")
    fun findUser(@Valid @RequestBody payload: FindUserPayload) = usersFacade.find(payload.filter)

    @PostMapping("getAllUsers")
    fun getAllUsers() = usersFacade.getAll()

    @GetMapping("syncUsers")
    fun syncUsers(@RequestParam params: Map<String, String>) = electricShapeProxy.streamTable("users", params)

    data class UpdateUserPayload(val id: UUID, @field:JsonUnwrapped val data: UpdateUser)

    @PostMapping("updateUser")
    fun updateUser(@Valid @RequestBody payload: UpdateUserPayload) = usersFacade.update(payload.id, payload.data)

    data class DeleteUserPayload(val id: UUID)

    @PostMapping("deleteUser")
    fun deleteUser(@Valid @RequestBody payload: DeleteUserPayload) = usersFacade.delete(payload.id)
}
