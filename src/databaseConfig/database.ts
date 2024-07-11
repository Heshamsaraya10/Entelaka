import { tr } from "@faker-js/faker";
import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: "postgres",
  database: "NewDB",
  username: "postgres",
  password: "12345",
  host: "localhost",
  port: 5432,
  logging: false,
});
export const dbConnect = async () => {
  try {
    sequelize.authenticate();
    console.log(`Database Connected: ${sequelize.config.host}`);
  } catch (error) {
    console.error("Connection error", error);
  }
};
export { sequelize };
export default dbConnect;
