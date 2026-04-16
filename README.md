# Monitoramento Industrial

Sistema de monitoramento industrial em tempo real com simulação de sensores (pressão, temperatura, vazamento, flare).

---

## 🗂️ Estrutura do Projeto

```
monitoramento-industrial/
├── backend/
│   ├── src/main/java/
│   │   └── Main.java       # Servidor HTTP + simulação dos sensores
│   └── pom.xml             # Configuração Maven
├── frontend/
│   └── projecthorizon-front/
│       ├── src/
│       │   └── App.jsx     # Interface React
│       ├── .env.local      # URL do backend (não vai pro GitHub)
│       └── package.json
└── README.md
```

---

## Pré-requisitos

Antes de rodar, verifique se tem instalado:

| Ferramenta | Versão mínima | Verificar com |
|------------|---------------|---------------|
| Java JDK   | 17+           | `java -version` |
| Maven      | 3.8+          | `mvn -version` |
| Node.js    | 18+           | `node -version` |
| npm        | 9+            | `npm -version` |

---

##  Como rodar localmente

### 1. Clone o repositório

```bash
git clone https://github.com/SEU_USUARIO/monitoramento-industrial.git
cd monitoramento-industrial
```

### 2. Rode o Backend (Java)

```bash
cd backend
mvn compile
mvn exec:java -Dexec.mainClass="Main"
```

O servidor vai iniciar em `http://localhost:8080`.  
Você verá no terminal: `Server running on port 8080`

### 3. Configure o Frontend

Em outro terminal:

```bash
cd frontend/projecthorizon-front
```

Crie o arquivo `.env.local` na raiz do frontend com o seguinte conteúdo:

```
VITE_API_URL=http://localhost:8080
```

### 4. Rode o Frontend

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173` no navegador.

---

## Endpoints da API

| Método | Rota    | Descrição                        |
|--------|---------|----------------------------------|
| GET    | `/data` | Retorna dados simulados dos sensores |

### Exemplo de resposta:

```json
{
  "pressao": 142,
  "temperatura": 87,
  "vazamento": false,
  "risco": "Alerta",
  "estado": "Perigo",
  "flare": false
}
```

---

##  Níveis de Risco

| Risco    | Condição                                          | Visual   |
|----------|---------------------------------------------------|----------|
| Crítico  | Vazamento, temperatura > 120°C ou pressão > 150bar | ⚫ Preto |
| Alerta   | Temperatura > 80°C ou pressão > 130bar            | 🔴 Vermelho |
| Instável | Temperatura > 60°C ou pressão > 110bar            | 🟡 Amarelo |
| Baixo    | Dentro dos parâmetros normais                     | 🔵 Azul    |

---

## Tecnologias

- **Backend:** Java 17, `com.sun.net.httpserver` (servidor HTTP nativo)
- **Frontend:** React 18, Vite, Tailwind CSS
- **Comunicação:** REST API (JSON)

---

## Observações

- Os dados são **simulados aleatoriamente** a cada requisição — não há sensores físicos conectados.
- O frontend atualiza os dados automaticamente a cada **10 segundos**.
- O arquivo `.env.local` **não deve ser commitado** no GitHub (já está no `.gitignore` por padrão no Vite).