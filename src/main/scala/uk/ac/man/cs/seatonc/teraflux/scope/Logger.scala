package uk.ac.man.cs.seatonc.teraflux.scope

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
    var messageQueue = List[String]()

    def threadCreated(child:DFThread, parent:DFThread) {
        queue(generate(Map(
            "message" -> "thread-created",
            "parent" -> parent.logID,
            "child" -> child.logID,
            "time" -> getTime())))
    }

    def threadCreated(child:DFThread, manager:DFManager) {
        queue(generate(Map(
            "message" -> "thread-created",
            "parent" -> 0,
            "child" -> child.logID,
            "time" -> getTime())))
    }

    def barrierCreated(bar:DFBarrier, sC:Int) {
        // Ignore
    }
    
    def tokenPassed(from:DFThread, to:DFThread, argNo:Int) {
        queue(generate(Map(
            "message" -> "token-passed",
            "from" -> from.logID,
            "to" -> to.logID,
            "arg" -> argNo,
            "time" -> getTime())))
    }
    
    def tokenPassed(from:DFManager, to:DFThread, argNo:Int) {
        queue(generate(Map(
            "message" -> "token-passed",
            "from" -> 0,
            "to" -> to.logID,
            "arg" -> argNo,
            "time" -> getTime())))
    }
    
    def nullTokenPassed(from:DFThread) {
        // Ignore
    }
    
    def threadStarted(thread:DFThread) {
        queue(generate(Map(
            "message" -> "thread-started",
            "thread" -> thread.logID,
            "worker" -> getWorkerName(),
            "time" -> getTime())))
    }
    
    def threadFinished(thread:DFThread) {
        queue(generate(Map(
            "message" -> "thread-finished",
            "thread" -> thread.logID,
            "time" -> getTime())))
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

                queue(generate(Map("message" -> "connected")))

                flag.put(())

                var finished = false

                while (!finished) {
                    val messages = atomic {
                        val tempMessages = messageQueue
                        messageQueue = Nil
                        tempMessages
                    }

                    for (message <- messages.reverse) {
                        if (message == null)
                            finished = true
                        else
                            webSocketConnection.send(message)
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
        queue(generate(Map("message" -> "finished")))
        queue(null)
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

    def queue(message: String) {
        atomic {
            messageQueue ::= message
        }
    }
}
