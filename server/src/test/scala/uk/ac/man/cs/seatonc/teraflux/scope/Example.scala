package uk.ac.man.cs.seatonc.teraflux.scope

import java.util.Random

import eu.teraflux.uniman.dataflow._

object Example extends DFApp {
    val random = new Random()

    def DFMain(args: Array[String]) {
        val print = DFManager.createThread((a: Int) => System.out.println(a))

        val root = DFManager.createThread(fib _)
        root.arg1 = 10
        root.arg2 = print.token1
    }

    def fib(n : Int, out: Token[Int]) {
        Thread.sleep(random.nextInt(1000))

        if (n < 2) {
            n
        } else {
            val adder = DFManager.createThread((a: Int, b: Int) => out(a + b))

            val a = DFManager.createThread(fib _)
            a.arg1 = n - 1
            a.arg2 = adder.token1

            val b = DFManager.createThread(fib _)
            b.arg1 = n - 2
            b.arg2 = adder.token2
        }
    }
}
