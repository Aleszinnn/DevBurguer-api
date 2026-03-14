import { Router } from "express";
import multer from "multer";
import multerConfig from "./config/multer";
import authMiddleware from "./middlewares/auth";

import adminMiddleware from './app/middlewares/auth';

import CategoryController from "./app/controllers/CategoryController";
import ProductController from "./app/controllers/ProductController";
import SessionController from "./app/controllers/SessionController";
import UserController from "./app/controllers/UserController";
import OrderController from "./app/controllers/OrderController";

const routes = new Router();

const upload = multer(multerConfig);

routes.post("/users", UserController.store);
routes.post("/session", SessionController.store);

routes.use(authMiddleware);
routes.post("/products", adminMiddleware, upload.single("file"), ProductController.store);
routes.put("/products/:id", adminMiddleware, upload.single("file"), ProductController.update);
routes.get("/products", ProductController.index);


routes.post("/categories", adminMiddleware, upload.single("file"), CategoryController.store);
routes.get("/categories", upload.single("file"), CategoryController.index);
routes.post("/orders", adminMiddleware, OrderController.store)

export default routes;