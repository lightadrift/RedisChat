import { createClient } from "redis";
import { Schema, Entity, Repository } from "redis-om";
import { nanoid } from "nanoid";
import * as dotenv from "dotenv";

dotenv.config();

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
    const id = await this.db.hGet("users", username);
    return await this.db.hGet(`User:${id}`, "password");
  }

  async getId(username: string) {
    return this.db.hGet("users", username);
  }

  // caso esteja usando redis sem Redis Search ou semelhantes, essa função cria um usuario em uma string
  async CreateUser(username: string, password: string, email: string) {
    const id = nanoid();
    const data = {
      username: username,
      id: id,
      password: password,
      email: email,
      isOnline: "false",
    };
    await this.db.hSet(`User:${id}`, data);
    await this.db.hSet("users", username, id);
    return;
  }

  // // checka se o usuario existe já na db
  async CheckUsername(username: string) {
    return await this.db.hExists("users", username);
  }

  async CreateRoom(userID: string, room_name: string) {
    const new_id = nanoid();
    const data = {
      name: room_name,
      owner: userID,
    };
    await this.db.hSet(`room:${"R:" + new_id}`, data);
    await this.db.sAdd(`room:${"R:" + new_id}:users`, userID);
    await this.db.sAdd(`User:${userID}:rooms`, `room:${"R:" + new_id}`);
  }

  async getRooms(userID: string) {
    return await this.db.sMembers(`User:${userID + ":rooms"}`);
  }

  // adiciona uma mensagem a db. note que a mensagem em si não há nada de especial. como isso é um projeto pequeno, há muito espaço
  // para melhorias. como por exemplo adicionar ids snowflakes or variados a mensagem pra que lá na frente seja fácil de excluir, buscar e etc
  async Message(msg: string, room: string, timestamp: number) {
    await this.db.zAdd(room, { score: timestamp, value: msg });
  }
}
