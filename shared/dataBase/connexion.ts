import { Sequelize } from "sequelize";
import { config } from "dotenv";
config();

const BD_STORAGE = process.env.BD_STORAGE;

const dbInstance = new Sequelize({
  dialect: "sqlite",
  storage: BD_STORAGE,
  logging: false,
});

export default dbInstance;
