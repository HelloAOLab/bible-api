import org.jetbrains.kotlin.gradle.dsl.JvmTarget

plugins {
    kotlin("jvm") version "2.2.21"
    kotlin("plugin.serialization") version "2.2.21"
    `java-library`
    `maven-publish`
}

repositories {
    mavenCentral()
}

dependencies {
    api("org.jetbrains.kotlinx:kotlinx-serialization-json:1.9.0")
    api("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.10.2")

    testImplementation(kotlin("test"))
    testImplementation("org.jetbrains.kotlinx:kotlinx-coroutines-test:1.10.2")
}

java {
    // Java 8 bytecode keeps the library usable on Android and older JVMs.
    sourceCompatibility = JavaVersion.VERSION_1_8
    targetCompatibility = JavaVersion.VERSION_1_8
    withSourcesJar()
}

kotlin {
    explicitApi()
    compilerOptions {
        jvmTarget.set(JvmTarget.JVM_1_8)
    }
}

tasks.test {
    useJUnitPlatform()
}

publishing {
    publications {
        create<MavenPublication>("maven") {
            artifactId = "free-use-bible-api"
            from(components["java"])

            pom {
                name.set("Free Use Bible API")
                description.set("Access over 1000 Bible translations in over 700 languages for free")
                url.set("https://bible.helloao.org/docs/")
                licenses {
                    license {
                        name.set("MIT")
                        url.set("https://github.com/HelloAOLab/bible-api/blob/main/LICENSE")
                    }
                }
                developers {
                    developer {
                        name.set("Kallyn Gowdy")
                        email.set("kal@helloao.org")
                    }
                }
                scm {
                    url.set("https://github.com/HelloAOLab/bible-api")
                    connection.set("scm:git:https://github.com/HelloAOLab/bible-api.git")
                }
            }
        }
    }
}
