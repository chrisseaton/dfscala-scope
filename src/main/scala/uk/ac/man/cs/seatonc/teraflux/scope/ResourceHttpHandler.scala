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

        val file = getResource(request.uri)

        override protected def exists: Boolean =
            file match {
                case None => false
                case Some(f) => f.exists
            }

        override protected def isDirectory: Boolean =
            file match {
                case None => false
                case Some(f) => f.isDirectory
            }

        override protected def fileBytes: Array[Byte] =
            file match {
                case None => null
                case Some(f) => {
                    if (f.isFile)
                        readResource(f)
                    else
                        null
                }
            }

        override protected def welcomeBytes: Array[Byte] =
            readResource(new File(klass.getResource(prefix + "/index.html").getFile()))

        override protected def directoryListingBytes: Array[Byte] =
            null

        def getResource(path: String) : Option[File] =
            klass.getResource(prefix + path) match {
                case null => None
                case url => Some(new File(url.getFile))
            }

        def readResource(resource: File): Array[Byte] = {
            val bytes = new Array[Byte](resource.length.toInt)
            val stream = new FileInputStream(resource)
            try {
                stream.read(bytes)
            } finally {
                stream.close()
            }
            bytes
        }
    }
}