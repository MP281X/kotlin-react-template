package com.backend.core.audits

import com.backend.core.auth.Secured
import com.backend.utils.ElectricShapeProxy
import com.fasterxml.jackson.annotation.JsonUnwrapped
import jakarta.validation.Valid
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*

@Secured
@RestController
@Validated
class AuditsController(private val auditsFacade: AuditsFacade, private val electricShapeProxy: ElectricShapeProxy) {
    data class FindAuditPayload(@field:JsonUnwrapped val filter: FindAudit)

    @PostMapping("findAudit")
    fun findAudit(@Valid @RequestBody payload: FindAuditPayload) = auditsFacade.find(payload.filter.id)

    @PostMapping("getAllAudits")
    fun getAllAudits() = auditsFacade.getAll()

    @GetMapping("syncAudits")
    fun syncAudits(@RequestParam params: Map<String, String>) = electricShapeProxy.streamTable("audits", params)
}
