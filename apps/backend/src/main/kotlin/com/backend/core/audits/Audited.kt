package com.backend.core.audits

import com.backend.core.auth.AuthRequestContext
import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.ObjectMapper
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.aspectj.lang.JoinPoint
import org.aspectj.lang.annotation.AfterReturning
import org.aspectj.lang.annotation.Aspect
import org.aspectj.lang.annotation.Pointcut
import org.aspectj.lang.reflect.MethodSignature
import org.jooq.JSONB
import org.slf4j.LoggerFactory
import org.springframework.expression.ExpressionParser
import org.springframework.expression.ParserContext
import org.springframework.expression.spel.standard.SpelExpressionParser
import org.springframework.expression.spel.support.StandardEvaluationContext
import org.springframework.stereotype.Component
import java.util.*

@Target(AnnotationTarget.FUNCTION)
@Retention(AnnotationRetention.RUNTIME)
annotation class Audited(
    val message: String
)

@Aspect
@Component
class AuditAspect(
    private val auditsFacade: AuditsFacade,
    private val authRequestContext: AuthRequestContext,
    private val objectMapper: ObjectMapper
) {
    private val logger = LoggerFactory.getLogger(AuditAspect::class.java)
    private val parser: ExpressionParser = SpelExpressionParser()

    @Pointcut("@annotation(audited) && execution(* *(..))")
    fun auditedMethod(audited: Audited) {}

    @AfterReturning("auditedMethod(audited)", returning = "result")
    fun logAudit(joinPoint: JoinPoint, audited: Audited, result: Any?) {
        try {
            val methodSignature = joinPoint.signature as MethodSignature
            val paramNames = methodSignature.parameterNames ?: emptyArray()
            val args = joinPoint.args

            val context =
                StandardEvaluationContext().apply {
                    setVariable("result", result)
                    paramNames.forEachIndexed { i, name -> if (i < args.size) setVariable(name, args[i]) }
                }

            val evaluatedMessage = parser.parseExpression(audited.message, ParserContext.TEMPLATE_EXPRESSION).getValue(context, String::class.java) ?: audited.message

            val paramMap =
                (paramNames zip args)
                    .filter { (_, value) -> value !is HttpServletRequest && value !is HttpServletResponse }
                    .toMap()

            val payload =
                buildMap<String, Any?> {
                    paramMap["id"]?.let { put("id", it) }
                    putAll(paramMap.filterKeys { it !in setOf("data", "id") })
                    paramMap["data"]?.let { data -> putAll(objectMapper.convertValue(data, object : TypeReference<Map<String, Any>>() {})) }
                }

            auditsFacade.create(evaluatedMessage, payload, result, authRequestContext.userId)
        } catch (ex: Exception) {
            logger.warn("Failed to create audit log", ex)
        }
    }
}
