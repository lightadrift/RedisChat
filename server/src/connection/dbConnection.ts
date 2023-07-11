import { createClient } from "redis";
import { Schema, Entity, Repository } from "redis-om";
import { nanoid } from "nanoid";
import * as dotenv from "dotenv";




dotenv.config()

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
  db;
  constructor() {
    this.db = createClient({
      url: process.env.UPSTASH_URL,
      pingInterval: 10000,
    });
    this.connect();
  }

  // função para conectar. Se estiver usando um jeito diferente de usar Redis isso aqui pode mudar um pouco
  async connect() {
    await this.db.connect();
  }
  async ping() {
    const t = await this.db.ping();
    console.log(t);
    return t;
  }

  async test() {
    return this.db.isReady;
  }

  async getSaltPw(username: string) {
    const id = await this.db.hGet("users", username)
    return await this.db.hGet(`User:${id}`, "password")
  }


  async getId(username: string) {
    return this.db.hGet("users", username)
  }
  // função para fechamento de conexão. as vezes pode ser necessário
  // async close() {
  //   await this.conn.quit();
  // }

  // // caso tu usando a função do Redis OM de esquemas, essas função cria um repositorio para leitura e inscrição de novas entidades
  // fetch(schema: Schema<any>) {
  //   return this.conn.fetchRepository(schema);
  // }

  // caso esteja usando redis sem Redis Search ou semelhantes, essa função cria um usuario em uma string
  async CreateUser(username: string, password: string, email: string) {
    const id = nanoid()
    const data = {
      username: username,
      id: id,
      password: password,
      email: email,
      isOnline: "false",
    };
    await this.db.hSet(`User:${id}`, data);
    await this.db.hSet('users', username, id)
    // await this.db.sAdd(`lookup:${username}`, id )
    // await this.db.sAdd('id_list', id)
    // this.user_repo.save(data);
    return;
  }

  // // essa função adiciona o usuario a um SET e incrementa o numero geral de usuarios em +1
  // async AddToList(username: string) {
  //   await this.conn.execute(["INCR", "id:users"]);
  //   return await this.conn.execute(["SADD", "Users", username]);
  // }

  // // checka se o usuario existe já na db
  async CheckUsername(username: string) {
    return await this.db.hExists("users", username);
  }

  // // checka se a senha é a mesma cadastrada na db
  // async CheckPassoword({ password, username }: PropsPasswordCheck) {
  //   const check = (await this.conn.execute([
  //     "GET",
  //     `user:${username}`,
  //   ])) as string;
  //   const user = JSON.parse(check) as ResposePasswordCheck;
  // }
}
