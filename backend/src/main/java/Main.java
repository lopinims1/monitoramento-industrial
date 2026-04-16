package main.java;

import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;

import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.util.Random;

public class Main {
    public static void main(String[] args) throws Exception {

        
        String portEnv = System.getenv("PORT");
        int port = (portEnv != null) ? Integer.parseInt(portEnv) : 8080;

        HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);
        server.createContext("/data", new MyHandler());
        server.setExecutor(null);
        server.start();

        System.out.println("Server running on port " + port);
    }

    static class MyHandler implements HttpHandler {

        Random random = new Random();

        @Override
        public void handle(HttpExchange exchange) {
            try {
                int pressao = 80 + random.nextInt(100);
                int temperatura = 20 + random.nextInt(100);
                boolean vazamento = random.nextBoolean();

                String risco;
                String estado;
                boolean flare;

                if (vazamento || temperatura > 120 || pressao > 150) {
                    risco = "Crítico";
                    estado = "Urgente";
                    flare = true;
                } else if (temperatura > 80 || pressao > 130) {
                    risco = "Alerta";
                    estado = "Perigo";
                    flare = false;
                } else if (temperatura > 60 || pressao > 110) {
                    risco = "Instável";
                    estado = "Seguro";
                    flare = false;
                } else {
                    risco = "Baixo";
                    estado = "Seguro";
                    flare = false;
                }

                System.out.println("Flare: " + (flare ? "Necessário" : "Desnecessário"));

                String res = "{"
                        + "\"pressao\": " + pressao + ","
                        + "\"temperatura\": " + temperatura + ","
                        + "\"vazamento\": " + vazamento + ","
                        + "\"risco\": \"" + risco + "\","
                        + "\"estado\": \"" + estado + "\","
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