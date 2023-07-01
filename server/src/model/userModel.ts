import { Schema, Entity } from "redis-om";

// Modelo para estruturar a data no sua DB

interface User {
  username: string;
  password: string;
  email: string;
  isOnline: boolean;
}

// class User extends Entity {}

// Você pode usar esse schema caso seu Redis DB estiver implementado com Redis Search
// Caso estiver usando UPSTASH, use comandos crus. UPSTASH ainda não suporta FT.Search, dificultando o uso de schemas

export const Users = new Schema(
  'User',
  {
    username: { type: "string", indexed: true },
    password: { type: "string" },
    email: { type: "string" },
    isOnline: { type: "boolean" },
  },
  {
    dataStructure: "HASH",
  }
);
