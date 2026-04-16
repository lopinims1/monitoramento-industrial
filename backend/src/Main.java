import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;

import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.util.Random;

public class Main {
    public static void main(String[] args) throws Exception {
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);

        server.createContext("/data", new MyHandler());

        server.setExecutor(null);
        server.start();

        System.out.println("Server running on http//localhost:8080/data");
    }

    static class MyHandler implements HttpHandler {

        Random random = new Random();

        @Override
        public void handle(HttpExchange exchange) {
            try {
                //sensor simulator
                int pressao = 80 + random.nextInt(100);
                int temperatura = 20 + random.nextInt(100);
                boolean vazamento = random.nextBoolean();

                String risco;
                boolean flare = random.nextBoolean();

                if (flare) {
                    System.out.println("Necessário");
                } else {
                    System.out.println("Desnecessário");
                }

                if(vazamento || temperatura > 120 || pressao > 150 ){
                    risco = "Crítico";
                    flare = true;
                } else if (temperatura > 80 && temperatura < 120 || pressao > 130 && pressao < 150 ) {
                    risco = "Alerta";
                    flare = false;
                } else if (temperatura > 60 && temperatura < 80 || pressao > 110 && pressao < 130) {
                    risco = "Instável";
                    flare = false;
                } else {
                    risco = "Baixo";
                    flare = false;
                }

                String res = "{"
                        + "\"pressao\": " + pressao + ","
                        + "\"temperatura\": " + temperatura + ","
                        + "\"vazamento\": " + vazamento + ","
                        + "\"risco\": \"" + risco + "\","
                        + "\"flare\": " + flare
                        + "}";

                byte[] responseBytes = res.getBytes("UTF-8");

                exchange.getResponseHeaders().add("Content-Type", "application/json; charset=utf-8");
                exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");

                exchange.sendResponseHeaders(200, responseBytes.length);

                OutputStream os = exchange.getResponseBody();
                os.write(responseBytes);
                os.close();

            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}

