import express from "express";
import wellcomeRoutes from "../src/modules/wellcome.routes.js";
import ordersRoutes from "../src/modules/orders/orders.routes.js";
import usersRoutes from "../src/modules/users/users.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(express.json());
app.use("/", wellcomeRoutes);
app.use("/orders", ordersRoutes);
app.use("/users", usersRoutes);

app.use(errorHandler)
export default app;
