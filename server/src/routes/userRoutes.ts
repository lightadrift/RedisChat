import express from "express"
import {login, register} from "../controller/userController"
export const Router = express.Router()

Router.post("/register", register);
Router.post("/login", login)

