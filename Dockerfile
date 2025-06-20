# 使用 Maven 基底映像來編譯並打包
FROM maven:3.8.4-openjdk-17-slim AS builder

# 設定工作目錄
WORKDIR /app

# 複製專案檔案到容器中
COPY . /app

# 編譯專案並打包 jar 檔案
RUN mvn clean package -DskipTests

# 使用較小的 JDK 映像來運行應用
FROM openjdk:17-jdk-slim

# 設定工作目錄
WORKDIR /app

# 複製從上面階段建立的 jar 檔案
COPY --from=builder /app/target/clinic-registration-0.0.1-SNAPSHOT.jar app.jar

# 開放端口
EXPOSE 8080

# 設定執行指令
ENTRYPOINT ["sh", "-c", "java -jar app.jar --server.port=$PORT"]
