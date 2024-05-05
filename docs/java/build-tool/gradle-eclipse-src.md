# gradle 改造旧 `eclipse` 项目

```groovy
plugins {
    id 'java'
}

task setupWrapper(type: Wrapper) {
    gradleVersion = '8.5' // 设置要使用的 Gradle 版本号
    distributionType = Wrapper.DistributionType.BIN // 设置分发类型为二进制
    validateDistributionUrl = false // 添加这一行来指定值
}

allprojects {
    repositories {
        mavenCentral()
    }
    sourceSets {
        src {
            java {
                srcDirs("src")
            }
        }
    }
}
```