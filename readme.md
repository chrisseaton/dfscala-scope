DFScala Scope Tool
==================

What is this?
-------------

This is a debugging tool for DFScala applications. It's read-only so it's more
like a scope than a graphical debugger.

![DFScala Scope Screenshot](http://github.com/chrisseaton/dfscala-scope/raw/master/other/screenshot.png)

Who wrote this?
---------------

Chris Seaton, seatonc@cs.man.ac.uk.

See licence.txt.

Dependencies
------------

*   Scala 2.9.1
*   SBT 0.11
*   Modern browser (latest Safari, Chrome, Firefox work)

Other dependencies are included in lib or lib_managed.

Compiling
---------

If you are compiling within the DFScala SVN repository, you will need to build
DFScala first.

    sbt compile

To create a single Jar with all dependencies:

    ./bundle

Testing
-------

    sbt test
    ./test

Using
-----

Run your DFScala program using:

    -Deu.teraflux.uniman.dataflow.logger=uk.ac.man.cs.seatonc.teraflux.scope.Logger

It will prompt you to open your browser and connect.

Caveats
-------

Java does not always successfuly determine your hostname. If you are using it
on your local machine and the link it gives you does not work try
http://localhost:8080/ instead.
