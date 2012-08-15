name := "dfscala-scope"

version := "0.2"

scalaVersion := "2.9.1"

resolvers += "com.codahale" at "http://repo.codahale.com"

libraryDependencies += "com.codahale" % "jerkson_2.9.1" % "0.5.0"

libraryDependencies += "org.webbitserver" % "webbit" % "0.4.14"

retrieveManaged := true

scalacOptions ++= Seq("-unchecked", "-deprecation")
