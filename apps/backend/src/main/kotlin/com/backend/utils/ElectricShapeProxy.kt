package com.backend.utils

import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpHeaders
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Component
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody
import java.net.URI
import java.net.URLEncoder
import java.net.http.HttpClient
import java.net.http.HttpRequest
import java.net.http.HttpResponse
import java.nio.ByteBuffer
import java.nio.charset.StandardCharsets.UTF_8
import java.util.concurrent.CountDownLatch
import java.util.concurrent.Flow

@Component
class ElectricShapeProxy(@param:Value("\${electric.url}") private val electricBaseUrl: String) {
    private val httpClient = HttpClient.newBuilder().version(HttpClient.Version.HTTP_2).build()

    fun streamTable(table: String, params: Map<String, String>): ResponseEntity<StreamingResponseBody> {
        val queryParams =
            (params + ("table" to table))
                .map { "${URLEncoder.encode(it.key, UTF_8)}=${URLEncoder.encode(it.value, UTF_8)}" }
                .joinToString("&")

        val request =
            HttpRequest
                .newBuilder()
                .uri(URI.create("$electricBaseUrl/v1/shape?$queryParams"))
                .header("Accept", "application/json")
                .build()

        val response = httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofPublisher()).join()

        val headers =
            HttpHeaders().apply {
                response.headers().map().forEach { (key, values) ->
                    if (key.lowercase() !in setOf("connection", "keep-alive", "transfer-encoding", "upgrade")) {
                        put(key, values.toList())
                    }
                }
            }

        return ResponseEntity
            .status(response.statusCode())
            .headers(headers)
            .body(
                StreamingResponseBody { out ->
                    @Suppress("UNCHECKED_CAST")
                    val publisher = response.body() as Flow.Publisher<MutableList<ByteBuffer>>
                    val latch = CountDownLatch(1)
                    val channel =
                        java.nio.channels.Channels
                            .newChannel(out)
                    var counter = 0
                    val flushInterval = 16

                    publisher.subscribe(
                        object : Flow.Subscriber<MutableList<ByteBuffer>> {
                            private lateinit var subscription: Flow.Subscription

                            override fun onSubscribe(s: Flow.Subscription) {
                                subscription = s
                                s.request(1)
                            }

                            override fun onNext(item: MutableList<ByteBuffer>) {
                                for (buf in item) while (buf.hasRemaining()) channel.write(buf)

                                counter++
                                if (counter % flushInterval == 0) out.flush()

                                subscription.request(1)
                            }

                            override fun onError(t: Throwable) {
                                latch.countDown()
                            }

                            override fun onComplete() {
                                if (counter % flushInterval != 0) out.flush()
                                latch.countDown()
                            }
                        }
                    )

                    latch.await()
                }
            )
    }
}
