import express from "express";

const user = express.Router();

import UserController from "../controllers/user.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";
import checkScopeUser from "../middleware/checkScopeUser.js";
import isAdminMiddelware from "../middleware/isAdminMiddleware.js";


// user.get('/:userIds',authMiddleware,UserController.getUserControlleur)
user.get('/list',authMiddleware,UserController.getListUserControlleur)

user.get('/create',authMiddleware,isAdminMiddelware,UserController.getCreateUserControlleur)
user.post('/create',authMiddleware,isAdminMiddelware,UserController.postCreateUserControlleur)
user.get('/home',authMiddleware,UserController.getHome)
user.get('/create', UserController.getUCreateUserControlleur)
user.get('/update/:userId',authMiddleware,checkScopeUser,UserController.getUpdateUserControlleur)
user.post('/update/:userId',authMiddleware,checkScopeUser,UserController.postUpdateUserControlleur)
user.get('/delete/:userId',authMiddleware,isAdminMiddelware,UserController.getDeleteUserControlleur)

export default user;

