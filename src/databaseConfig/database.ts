import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: "postgres",
  database: process.env.DB_NAME,
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "12345",
  host: "localhost",
  port: 5432,
  logging: false,
});
export const dbConnect = async (): Promise<void> => {
  try {
    sequelize.authenticate();
    console.log(`Database Connected: ${sequelize.config.host}`);
  } catch (error) {
    console.error("Connection error", error);
  }
};
export { sequelize };
export default dbConnect;
