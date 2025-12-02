package com.backend.core.tasks

import org.springframework.cache.annotation.CacheConfig
import org.springframework.cache.annotation.CacheEvict
import org.springframework.cache.annotation.Cacheable
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional
import java.util.*

@Component
@CacheConfig(cacheNames = ["tasks"])
class TasksFacade(private val tasksRepository: TasksRepository) {
    @Transactional
    @CacheEvict(allEntries = true)
    fun create(data: CreateTask): UUID {
        return tasksRepository.create(data)
    }

    @Transactional(readOnly = true)
    @Cacheable(key = "#filter", sync = true)
    fun find(filter: FindTask): Task {
        return when (filter) {
            is FindTask.ById -> tasksRepository.findById(filter)
        }
    }

    @Transactional(readOnly = true)
    fun getAll(): List<Task> {
        return tasksRepository.getAll()
    }

    @Transactional
    @CacheEvict(allEntries = true)
    fun update(id: UUID, data: UpdateTask) {
        tasksRepository.update(id, data)
    }

    @Transactional
    @CacheEvict(allEntries = true)
    fun delete(id: UUID) {
        tasksRepository.delete(id)
    }
}
