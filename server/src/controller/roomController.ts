import { NextFunction, Request, Response } from "express";
import { Connection } from "../connection/dbConnection";

const db = new Connection();

export async function newServer(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const [room, userId] = req.body;
  if (db) {
    await db.CreateRoom(userId, room);
  }
}

export async function getRooms(req: Request, res: Response) {
const {userID} = req.body 
  console.log(userID)
//   console.log(userId)
  const rooms = await db.getRooms("2RhIJrRBNUlvWWnRZm2Ep");
  console.log(rooms)
//   if (rooms) {
//     return res.json(rooms);
//   } else {
//     return res.sendStatus(404);
//   }
return res.json(rooms)
}
