package com.backend

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class Application

fun clearConsole() {
    println("\u001b[H\u001b[2J")
    System.out.flush()
}

fun main(args: Array<String>) {
    clearConsole()
    runApplication<Application>(*args)
}
