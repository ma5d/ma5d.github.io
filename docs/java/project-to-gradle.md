# 项目转为gradle

1. 新建`settings.gradle`

```groovy
rootProject.name = 'redis1122'
```

2. 新建`build.gradle`文件

```grovvy
apply plugin: 'java'

allprojects {
    repositories {
        google()
        mavenCentral()
    }

    sourceSets {
        src {
            java {
                srcDirs += 'src'
            }
        }
    }

    dependencies {
        implementation 'junit:junit:4.13.2'
    }
}

tasks.withType(JavaCompile) {
    options.encoding = 'UTF-8'
}
```