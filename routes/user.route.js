import express from "express";

const user = express.Router();

import UserController from "../controllers/user.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";
import checkScopeUser from "../middleware/checkScopeUser.js";
import isAdminMiddelware from "../middleware/isAdminMiddleware.js";


// user.get('/:userIds',authMiddleware,UserController.getUserControlleur)
// user.get('/all',authMiddleware,UserController.getAllUserControlleur)

user.get('/create',authMiddleware,isAdminMiddelware,UserController.getCreateUserControlleur)
user.post('/create',authMiddleware,isAdminMiddelware,UserController.postCreateUserControlleur)
user.get('/home',UserController.getHome)
user.get('/update/:userId',authMiddleware,checkScopeUser,UserController.getUpdateUserControlleur)
user.post('/update/:userId',authMiddleware,checkScopeUser,UserController.postUpdateUserControlleur)


export default user;

