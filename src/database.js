import { createPool } from "mysql2";
import dotenv from "dotenv";

dotenv.config({ path: '../.env' });  // Carrega as variáveis do .env



const pool = createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection((err, connection) => {
    if (err) {
        console.log("Erro ao conectar ao banco de dados: " + err);
        return;
    }
    console.log("Conexão bem sucedida, ID da conexão: " + connection.threadId);
    connection.release();
});

export default pool;
