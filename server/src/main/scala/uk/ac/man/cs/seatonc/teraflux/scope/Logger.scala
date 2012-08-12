package uk.ac.man.cs.seatonc.teraflux.scope

import scala.util.Properties
import scala.concurrent.SyncVar

import org.webbitserver._

import eu.teraflux.uniman.transactions.TMLib._
import eu.teraflux.uniman.dataflow._

class Logger extends DFLogger {
    var startTime: Long = 0

    var nextThreadId = 1
    var nextManagerId = 0

    var serverThread: Thread = null
    var messageQueue = List[List[(String, String)]]()

    def threadCreated(child:DFThread, parent:DFThread) {
        queue(List("\"message\"" -> "\"thread-created\"",
            "\"parent\"" -> parent.logID.toString,
            "\"child\"" -> child.logID.toString,
            "\"time\"" -> getTime().toString))
    }

    def threadCreated(child:DFThread, manager:DFManager) {
        queue(List("\"message\"" -> "\"thread-created\"",
            "\"parent\"" -> "0",
            "\"child\"" -> child.logID.toString,
            "\"time\"" -> getTime().toString))
    }

    def barrierCreated(bar:DFBarrier, sC:Int) {
        // Ignore
    }
    
    def tokenPassed(from:DFThread, to:DFThread, argNo:Int) {
        queue(List("\"message\"" -> "\"token-passed\"",
            "\"from\"" -> from.logID.toString,
            "\"to\"" -> to.logID.toString,
            "\"arg\"" -> argNo.toString,
            "\"time\"" -> getTime().toString))
    }
    
    def tokenPassed(from:DFManager, to:DFThread, argNo:Int) {
        queue(List("\"message\"" -> "\"token-passed\"",
            "\"from\"" -> "0",
            "\"to\"" -> to.logID.toString,
            "\"arg\"" -> argNo.toString,
            "\"time\"" -> getTime().toString))
    }
    
    def nullTokenPassed(from:DFThread) {
        // Ignore
    }
    
    def threadStarted(thread:DFThread) {
        queue(List("\"message\"" -> "\"thread-started\"",
            "\"thread\"" -> thread.logID.toString,
            "\"worker\"" -> ("\"" + getWorkerName() + "\""),
            "\"time\"" -> getTime().toString))
    }
    
    def threadFinished(thread:DFThread) {
        queue(List("\"message\"" -> "\"thread-finished\"",
            "\"thread\"" -> thread.logID.toString,
            "\"worker\"" -> ("\"" + getWorkerName() + "\""),
            "\"time\"" -> getTime().toString))
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

                val webServer = WebServers.createWebServer(8080)
                webServer.add("/socket", webSocketHandler)
                webServer.start()

                System.err.println("scope: waiting for the connection from your browser...")

                val webSocketConnection = webSocketConnectionVar.take()

                queue(List("\"message\"" -> "\"connected\""))

                flag.put(())

                var finished = false

                while (!finished) {
                    val messages = atomic {
                        val tempMessages = messageQueue
                        messageQueue = Nil
                        tempMessages
                    }

                    for (message <- messages.reverse) {
                        if (message == Nil)
                            finished = true

                        val json = "{" + message.map(_.productIterator.mkString(":")).mkString(",") + "}"

                        System.err.println(json)
                        webSocketConnection.send(json)
                    }

                    if (messages == Nil)
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
        queue(List("\"message\"" -> "\"finished\""))
        queue(Nil)
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

    def queue(message: List[(String, String)]) {
        atomic {
            messageQueue ::= message
        }
    }
}
