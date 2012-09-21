/*

Copyright (c) 2012, The University of Manchester
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * Neither the name of The University of Manchester nor the
      names of its contributors may be used to endorse or promote products
      derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE UNIVERSITY OF MANCHESTER BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

package eu.teraflux.uniman.dataflow.scope

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