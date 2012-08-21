package uk.ac.man.cs.seatonc.teraflux.scope

import java.io._
import java.util.concurrent.Executors

import org.webbitserver._
import org.webbitserver.handler._

class ResourceHttpHandler[T](prefix: String, klass: Class[T]) extends AbstractResourceHandler(Executors.newFixedThreadPool(1)) {
    protected override def createIOWorker(
            request: HttpRequest,
            response: HttpResponse,
            control: HttpControl): IOWorker = {
        new Worker(request, response, control)
    }

    class Worker(
            request: HttpRequest,
            response: HttpResponse,
            control: HttpControl) extends IOWorker(request.uri(), request, response, control) {

        val requestPath = request.uri

        val resource = if (requestPath.endsWith("/"))
            prefix + requestPath + "index.html"
        else
            prefix + requestPath

        val resourceExists = klass.getResource(resource) != null

        override protected def exists: Boolean =
            resourceExists

        override protected def isDirectory: Boolean =
            false

        override protected def fileBytes: Array[Byte] =
            if (exists)
                readAll(klass.getResourceAsStream(resource))
            else
                null

        override protected def welcomeBytes: Array[Byte] =
            null

        override protected def directoryListingBytes: Array[Byte] =
            null

        def readAll(stream: InputStream): Array[Byte] = {
            var buffer = new Array[Byte](0)
            var offset = 0
            var finished = false

            while (!finished) {
                if (buffer.length - offset == 0) {
                    val newBuffer = new Array[Byte](buffer.length + 1024)
                    System.arraycopy(buffer, 0, newBuffer, 0, buffer.length)
                    buffer = newBuffer
                }

                stream.read(buffer, offset, buffer.length - offset) match {
                    case -1 => finished = true
                    case n => offset += n
                }
            }

            val finalBuffer = new Array[Byte](offset)
            System.arraycopy(buffer, 0, finalBuffer, 0, offset)
            finalBuffer
        }
    }
}