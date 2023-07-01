import type { NextFunction, Request, Response } from "express";
import { Connection } from "../connection/dbConnection";
import bcrypt from "bcrypt";


// instancia uma nova conexão a db
//  const db = new Connection();
const db = new Connection();
// tipagem dos props que chegam da requisição geral
interface ReqProps {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// função básica em REGEX que checka se a string de usuario tem 8 caracteres, uma letra maiúscula e um número
function checkSpecialLetters(str: string) {
  const specialChars = /^(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[#?!@$%^&*\-_]).{8,}$/;
  return specialChars.test(str);
}

//função de login de um usuario

// export const login = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { username, password } = req.body as ReqProps;
//     const usuario = await db.CheckUsername(username);

//     if (!usuario) {
//       return res.json({ msg: "Incorrect Username or Password", status: false });
//     }

//     return res.json({ status: true, usuario });
//   } catch (ex) {
//     next(ex);
//   }
// };

// função para cadastro de um usuario

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, password, confirmPassword } = req.body as ReqProps;
    console.log(username, email, password, confirmPassword);

    if (!password || !username || !email) {
      console.log("Senha invalida");
      return res.json({ msg: "Senha invalida", status: false });
    }

    if (!checkSpecialLetters(password) || password !== confirmPassword) {
      console.log("não foi2");
      return res.json({ msg: "Senha muito grande", status: false });
    }
    
    // const isUsernameCreated = async () => {
    //   console.log(await db.checkUsername(username))
    //   return await db.checkUsername(username)
    // }

    // if (await isUsernameCreated()) {
    //   console.log("usuario já existente");
    //   return res.json({ msg: "Username já cadastrado", status: false });
    // }
  
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.CreateUser(username, hashedPassword, email)

    // const hashedPassword = await bcrypt.hash(password, 10);
    // console.log(hashedPassword)
    // console.log(hashedPassword)
    // await db.CreateUser(username, hashedPassword, email).then(() => console.log("foi2"));
    // await db.AddToList(username);
    // console.log("cadastrado");
    return res.json({ msg: "Cadastrado", status: true });
  } catch (ex) {
    console.log("next");
    next(ex);
  }
};
