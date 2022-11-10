import { Client, Repository } from "redis-om";
import type { Schema } from "redis-om";

// Classe para fazer conexão com a db

interface PropsPasswordCheck {
  username?: string;
  password: string;
}

interface ResposePasswordCheck {
  password: string;
  email: string;
}

export class Connection {
  conn: Client;
  constructor() {
    this.conn = new Client();
  }

  // função para conectar. Se estiver usando um jeito diferente de usar Redis isso aqui pode mudar um pouco
  async connect() {
    await this.conn.open(process.env.UPSTASH_URL);
  }

  // função para fechamento de conexão. as vezes pode ser necessário
  async close() {
    await this.conn.close();
  }

  // caso tu usando a função do Redis OM de esquemas, essas função cria um repositorio para leitura e inscrição de novas entidades 
  fetch(schema: Schema<any>) {
    return this.conn.fetchRepository(schema);
  }


  // caso esteja usando redis sem Redis Search ou semelhantes, essa função cria um usuario em uma string
  async CreateUser(username: string, password: string, email: string) {
    return await this.conn.execute([
      "SET",
      `user:${username}`,
      `{"email": "${email}", "password": "${password}"}`,
    ]);
  }

  // essa função adiciona o usuario a um SET e incrementa o numero geral de usuarios em +1
  async AddToList(username: string) {
    await this.conn.execute(["INCR", "id:users"]);
    return await this.conn.execute(["SADD", "Users", username]);
  }

  // checka se o usuario existe já na db
  async CheckUsername(username: string) {
    return await this.conn.execute(["SISMEMBER", "Users", username]);
  }

  // checka se a senha é a mesma cadastrada na db
  async CheckPassoword({ password, username }: PropsPasswordCheck) {
    const check = (await this.conn.execute([
      "GET",
      `user:${username}`,
    ])) as string;
    const user = JSON.parse(check) as ResposePasswordCheck;
  }
}
