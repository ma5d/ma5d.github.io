# http client 上传文件

```http request
### 上传文件
POST https://ma5d.asia/upload
Content-Type: multipart/form-data; boundary=abcdefg123456789

--abcdefg123456789
Content-Disposition: form-data; name="file"; filename="/C:/Users/HP/IdeaProjects/OpenPDF/openpdf/target/test-classes/siwa.pdf"

< /C:/Users/HP/IdeaProjects/OpenPDF/openpdf/target/test-classes/siwa.pdf
--abcdefg123456789
```


```java
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;

public class FileUploadExample {
    public static void main(String[] args) throws IOException {
        // 构造请求URL
        URL url = new URL("https://ma5d.asia/upload");
        
        // 打开连接
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        
        // 设置请求方法为POST
        connection.setRequestMethod("POST");
        
        // 设置请求头部
        connection.setRequestProperty("Content-Type", "multipart/form-data; boundary=abcdefg123456789");
        
        // 启用输出流
        connection.setDoOutput(true);
        
        // 创建输出流
        try (OutputStream out = connection.getOutputStream();
             FileInputStream fileInputStream = new FileInputStream("/C:/Users/HP/IdeaProjects/OpenPDF/openpdf/target/test-classes/siwa.pdf")) {
            // 写入请求体
            out.write("--abcdefg123456789\r\n".getBytes());
            out.write("Content-Disposition: form-data; name=\"file\"; filename=\"siwa.pdf\"\r\n\r\n".getBytes());
            
            // 将文件内容写入输出流
            byte[] buffer = new byte[4096];
            int bytesRead;
            while ((bytesRead = fileInputStream.read(buffer)) != -1) {
                out.write(buffer, 0, bytesRead);
            }
            out.write("\r\n--abcdefg123456789--\r\n".getBytes());
            
            // 发送请求并获取响应
            int responseCode = connection.getResponseCode();
            if (responseCode == HttpURLConnection.HTTP_OK) {
                // 读取响应内容
                try (BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()))) {
                    String line;
                    StringBuilder response = new StringBuilder();
                    while ((line = in.readLine()) != null) {
                        response.append(line);
                    }
                    System.out.println("Response: " + response.toString());
                }
            } else {
                System.out.println("Error: " + responseCode);
            }
        } finally {
            // 关闭连接
            connection.disconnect();
        }
    }
}

```