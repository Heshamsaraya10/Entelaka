import path from "path";
import express, { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config({ path: "config.env" });
import i18n from "./i18n";

import dbConnect from "./databaseConfig/database";
import createTables from "./databaseConfig/tables";
import mountRoutes from "./hooks/hooks";
import { seedUsers } from "./sedeer";


// seedUsers()

//express app
const app = express();

//Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));
app.use(i18n.init);

mountRoutes(app);

const PORT = process.env.PORT || 3000;

app.get("*", (req: Request, res: Response) => {
  res.status(404).json({ message: "Bad Request" });
});

const start = async (): Promise<void> => {
  try {
    await dbConnect();
    await createTables();

    app.listen(PORT, () => {
      console.log(`App running on port ${PORT}`);
    });
  } catch (error) {
    console.log("Failed to start the server:", error);
    process.exit(1);
  }
};

void start();
