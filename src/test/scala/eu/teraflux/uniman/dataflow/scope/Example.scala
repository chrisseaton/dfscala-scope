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

import java.util.Random

import eu.teraflux.uniman.dataflow._

object Example extends DFApp {
    val random = new Random()

    def DFMain(args: Array[String]) {
        val print = DFManager.createThread((a: Int) => System.out.println(a))

        val root = DFManager.createThread(fib _)
        root.arg1 = 8
        root.arg2 = print.token1
    }

    def fib(n : Int, out: Token[Int]) {
        Thread.sleep(250 + random.nextInt(750))

        if (n < 2) {
            out(n)
        } else {
            val adder = DFManager.createThread((a: Int, b: Int) => {
                Thread.sleep(250 + random.nextInt(750));
                out(a + b);
            })

            val a = DFManager.createThread(fib _)
            a.arg1 = n - 1
            a.arg2 = adder.token1

            val b = DFManager.createThread(fib _)
            b.arg1 = n - 2
            b.arg2 = adder.token2
        }
    }
}
