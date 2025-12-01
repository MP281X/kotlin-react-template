package com.backend.core.users

import com.backend.web.InvalidCredentialsException
import org.mindrot.jbcrypt.BCrypt
import org.springframework.cache.annotation.CacheConfig
import org.springframework.cache.annotation.CacheEvict
import org.springframework.cache.annotation.Cacheable
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional
import java.util.*

@Component
@CacheConfig(cacheNames = ["users"])
class UsersFacade(private val usersRepository: UsersRepository) {
    @Transactional
    @Cacheable(key = "#data", sync = true)
    fun create(data: CreateUser): UUID {
        val hashedPassword = BCrypt.hashpw(data.password, BCrypt.gensalt())
        val hashedData = data.copy(password = hashedPassword)
        return usersRepository.create(hashedData)
    }

    @Transactional
    @Cacheable(key = "#data", sync = true)
    fun upsert(data: CreateUser): UUID {
        val existing = runCatching { find(FindUser.ByPrimaryKeys(email = data.email)) }.getOrNull()
        if (existing != null) return existing.id
        return create(data)
    }

    @Transactional(readOnly = true)
    @Cacheable(key = "#filter", sync = true)
    fun find(filter: FindUser): User {
        return when (filter) {
            is FindUser.ById -> usersRepository.findById(filter)
            is FindUser.ByPrimaryKeys -> usersRepository.findByPrimaryKeys(filter)
            is FindUser.ByEmailAndPassword -> {
                val user = usersRepository.findByEmailAndPassword(filter)
                if (!BCrypt.checkpw(filter.password, user.password)) throw InvalidCredentialsException("Invalid password")
                user
            }
        }
    }

    @Transactional(readOnly = true)
    fun getAll(): List<User> {
        return usersRepository.getAll()
    }

    @Transactional
    @CacheEvict(allEntries = true)
    fun update(id: UUID, data: UpdateUser) {
        val updatedData = data.password?.let { data.copy(password = BCrypt.hashpw(it, BCrypt.gensalt())) } ?: data
        usersRepository.update(id, updatedData)
    }

    @Transactional
    @CacheEvict(allEntries = true)
    fun delete(id: UUID) {
        usersRepository.delete(id)
    }
}
