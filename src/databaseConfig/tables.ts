import "../model/userModel";
import "../model/aboutUsPageModel";
import "../model/mediaCenterPage";

import { sequelize } from "./database";

const createTables = async () => {
  try {
    await sequelize.sync({ alter: true });
    // await sequelize.sync({ force: true });
    console.log("Table created successfully");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default createTables;
