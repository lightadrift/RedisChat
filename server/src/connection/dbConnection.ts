import { Client, Repository } from "redis-om";
import type { Schema } from "redis-om";

interface PropsPasswordCheck {
  username?: string;
  password: string;
}


interface ResposePasswordCheck {
	password: string,
	email: string
}

export class Connection {
  conn: Client;
  constructor() {
    this.conn = new Client();
  }

  async connect() {
    await this.conn.open(
      "redis://:f6b18b0ccf9844b08f961106bfbc849f@us1-sweet-koi-38946.upstash.io:38946"
    );
  }
  async close() {
    await this.conn.close();
  }

  fetch(schema: Schema<any>) {
    return this.conn.fetchRepository(schema);
  }

  async CreateUser(username: string, password: string, email: string) {
    return await this.conn.execute([
      "SET",
      `user:${username}`,
      `{"email": "${email}", "password": "${password}"}`,
    ]);
  }
  async AddToList(username: string) {
    await this.conn.execute(["INCR", "id:users"]);
    return await this.conn.execute(["SADD", "Users", username]);
  }
  async CheckUsername(username: string) {
    return await this.conn.execute(["SISMEMBER", "Users", username]);
  }
  async CheckPassoword({ password, username }: PropsPasswordCheck) {
    const check = (await this.conn.execute([
      "GET",
      `user:${username}`,
    ])) as string;
    const user = JSON.parse(check) as ResposePasswordCheck;
   
  }
}
