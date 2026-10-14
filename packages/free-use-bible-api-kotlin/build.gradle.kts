import com.vanniktech.maven.publish.JavadocJar
import com.vanniktech.maven.publish.KotlinJvm
import com.vanniktech.maven.publish.SourcesJar
import org.jetbrains.kotlin.gradle.dsl.JvmTarget

plugins {
    kotlin("jvm") version "2.2.21"
    kotlin("plugin.serialization") version "2.2.21"
    `java-library`
    id("com.vanniktech.maven.publish") version "0.36.0"
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

// Publishes to Maven Central (https://central.sonatype.com) under the org.helloao namespace.
// See .github/workflows/release-kotlin-workflow.yml for the credentials that this needs.
mavenPublishing {
    configure(KotlinJvm(javadocJar = JavadocJar.Empty(), sourcesJar = SourcesJar.Sources()))
    publishToMavenCentral()

    // Maven Central requires signed artifacts, but signing is skipped when no key is configured
    // so that publishToMavenLocal works without one.
    if (providers.gradleProperty("signingInMemoryKey").isPresent) {
        signAllPublications()
    }

    coordinates(group.toString(), "free-use-bible-api", version.toString())

    pom {
        name.set("Free Use Bible API")
        description.set("Access over 1000 Bible translations in over 700 languages for free")
        inceptionYear.set("2026")
        url.set("https://bible.helloao.org/docs/")
        licenses {
            license {
                name.set("MIT")
                url.set("https://github.com/HelloAOLab/bible-api/blob/main/LICENSE")
                distribution.set("repo")
            }
        }
        developers {
            developer {
                id.set("KallynGowdy")
                name.set("Kallyn Gowdy")
                email.set("kal@helloao.org")
                organization.set("HelloAO")
                organizationUrl.set("https://helloao.org")
            }
        }
        scm {
            url.set("https://github.com/HelloAOLab/bible-api")
            connection.set("scm:git:https://github.com/HelloAOLab/bible-api.git")
            developerConnection.set("scm:git:ssh://git@github.com/HelloAOLab/bible-api.git")
        }
        issueManagement {
            system.set("GitHub")
            url.set("https://github.com/HelloAOLab/bible-api/issues")
        }
    }
}
