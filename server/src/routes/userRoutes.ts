import express from "express"
import {register} from "../controller/userController"
export const Router = express.Router()

Router.post("/register", register);


