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

package uk.ac.man.cs.seatonc.teraflux.scope

import java.net.InetAddress

import scala.util.Properties
import scala.concurrent.SyncVar

import com.codahale.jerkson.Json._
import org.webbitserver._

import eu.teraflux.uniman.transactions.TMLib._
import eu.teraflux.uniman.dataflow._

class Logger extends DFLogger {
    var startTime: Long = 0

    var nextThreadId = 1
    var nextManagerId = 0

    var serverThread: Thread = null
    var messageQueue = List[Message]()

    abstract class Message {
        def toJson : String
    }

    case object ConnectedMessage extends Message {
        override def toJson : String = generate(Map(
            "message" -> "connected"))
    }

    case object FinishedMessage extends Message {
        override def toJson : String = generate(Map(
            "message" -> "finished"))
    }
    
    case class ThreadCreatedMessage(parent: Int, child: Int, time: Double) extends Message {
        override def toJson : String = generate(Map(
            "message" -> "thread-created",
            "parent" -> parent,
            "child" -> child,
            "time" -> time))
    }
    
    case class TokenPassedMessage(from: Int, to: Int, arg: Int, time: Double) extends Message {
        override def toJson : String = generate(Map(
            "message" -> "token-passed",
            "from" -> from,
            "to" -> to,
            "arg" -> arg,
            "time" -> time))
    }
    
    case class ThreadStartedMessage(thread: Int, worker: String, time: Double) extends Message {
        override def toJson : String = generate(Map(
            "message" -> "thread-started",
            "thread" -> thread,
            "worker" -> worker,
            "time" -> time))
    }
    
    case class ThreadFinishedMessage(thread: Int, time: Double) extends Message {
        override def toJson : String = generate(Map(
            "message" -> "thread-finished",
            "thread" -> thread,
            "time" -> time))
    }

    def threadCreated(child:DFThread, parent:DFThread) {
        atomic {
            messageQueue ::= ThreadCreatedMessage(parent.logID, child.logID, getTime())
        }
    }

    def threadCreated(child:DFThread, manager:DFManager) {
        atomic {
            messageQueue ::= ThreadCreatedMessage(0, child.logID, getTime())
        }
    }

    def barrierCreated(bar:DFBarrier, sC:Int) {
        // Ignore
    }
    
    def tokenPassed(from:DFThread, to:DFThread, argNo:Int) {
        atomic {
            messageQueue ::= TokenPassedMessage(from.logID, to.logID, argNo, getTime())
        }
    }
    
    def tokenPassed(from:DFManager, to:DFThread, argNo:Int) {
        atomic {
            messageQueue ::= TokenPassedMessage(0, to.logID, argNo, getTime())
        }
    }
    
    def nullTokenPassed(from:DFThread) {
        // Ignore
    }
    
    def threadStarted(thread:DFThread) {
        atomic {
            messageQueue ::= ThreadStartedMessage(thread.logID, getWorkerName(), getTime())
        }
    }
    
    def threadFinished(thread:DFThread) {
        atomic {
            messageQueue ::= ThreadFinishedMessage(thread.logID, getTime())
        }
    }
    
    def threadToBarrier(thread:DFThread, barrier:DFBarrier) {
        // Ignore
    }
    
    def threadFromBarrier(thread:DFThread, barrier:DFBarrier) {
        // Ignore
    }
    
    def barrierActivated(barrier:DFBarrier) {
        // Ignore
    }
    
    def barrierSatisfied(barrier:DFBarrier) {
        // Ignore
    }
    
    def createManager(manager:DFManager, parent:DFThread) {
        val flag = new SyncVar[Unit]()

        serverThread = new Thread(new Runnable() {
            def run() {
                val webSocketConnectionVar = new SyncVar[WebSocketConnection]()

                val webSocketHandler = new BaseWebSocketHandler {
                    override def onOpen(connection: WebSocketConnection) {
                        webSocketConnectionVar.put(connection)
                    }
                }

                val port = 8080

                val webServer = WebServers.createWebServer(port)
                webServer.add(new ResourceHttpHandler("/client", classOf[Logger]))
                webServer.add("/socket", webSocketHandler)
                webServer.start()
                
                System.err.println("scope: go to http://" + getHostName() + ":" + port + "/")

                val webSocketConnection = webSocketConnectionVar.take()

                atomic {
                    messageQueue ::= ConnectedMessage
                }

                flag.put(())

                var finished = false

                while (!finished) {
                    val messages = atomic {
                        val temp = messageQueue
                        messageQueue = Nil
                        temp
                    }

                    for (message <- messages.reverse) {
                        webSocketConnection.send(message.toJson)

                        if (message == FinishedMessage)
                            finished = true
                    }

                    Thread.sleep(100)
                }

                webServer.stop()
            }
        })

        serverThread.start()

        flag.take()

        startTime = System.nanoTime()
    }
    
    def managerStart(manager:DFManager) {
        // Ignore
    }
    
    def managerFinish(manager:DFManager) {
        atomic {
            messageQueue ::= FinishedMessage
        }

        serverThread.join()
    }
    
    def getThreadID:Int =
        atomic {
            val id = nextThreadId
            nextThreadId += 1
            id
        }
    
    def getManagerID:Int =
        atomic {
            val id = nextManagerId
            nextManagerId += 1
            id
        }
    
    def getBarrierID:Int = {
        throw new UnsupportedOperationException()
    }

    def getTime(): Double =
        (System.nanoTime() - startTime) / 1e9

    def getWorkerName(): String =
        Thread.currentThread().getName()

    def getHostName(): String =
        InetAddress.getLocalHost().getCanonicalHostName()
}
