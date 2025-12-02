package com.backend

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class Application

/** Clears terminal before Spring Boot startup for cleaner dev experience. */
fun clearConsole() {
    println("\u001b[H\u001b[2J")
    System.out.flush()
}

fun main(args: Array<String>) {
    clearConsole()
    runApplication<Application>(*args)
}
