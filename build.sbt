import AssemblyKeys._

name := "dfscala-scope"

version := "0.2"

scalaVersion := "2.9.1"

resolvers += "com.codahale" at "http://repo.codahale.com"

assemblySettings

assembleArtifact in packageScala := false

//excludedJars in assembly ++= Seq("lib/muts_2.8-rv41.jar", "lib/dflib-rv291.jar")

libraryDependencies += "com.codahale" % "jerkson_2.9.1" % "0.5.0"

libraryDependencies += "org.webbitserver" % "webbit" % "0.4.14"

retrieveManaged := true

scalacOptions ++= Seq("-unchecked", "-deprecation")
