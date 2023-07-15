import express from "express";
import { login, register } from "../controller/userController";
import { getRooms, newServer } from "../controller/roomController";


export const Router = express.Router();
export const RoomRouter = express.Router();


Router.post("/register", register);
Router.post("/login", login);
RoomRouter.post("/createRoom", newServer);
RoomRouter.get("/getRooms", getRooms);
