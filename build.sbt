import AssemblyKeys._

name := "dfscala-scope"

version := "0.2"

scalaVersion := "2.9.1"

resolvers += "com.codahale" at "http://repo.codahale.com"

assemblySettings

assembleArtifact in packageScala := false

excludedJars in assembly <<= (fullClasspath in assembly) map {
    _.filter( c => c.data.getName.contains("muts") || c.data.getName.contains("dflib") )
}

libraryDependencies += "com.codahale" % "jerkson_2.9.1" % "0.5.0"

libraryDependencies += "org.webbitserver" % "webbit" % "0.4.14"

retrieveManaged := true

scalacOptions ++= Seq("-unchecked", "-deprecation")
