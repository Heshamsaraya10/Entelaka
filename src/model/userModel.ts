import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { sequelize } from "../databaseConfig/database";

interface UserAttributes {
  id: number;
  username: string;

  position: string;
  photo?: string;
  description?: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public username!: string;
  public position!: string;
  public photo?: string;
  public description?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  static username: any;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    position: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    photo: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "User",
  }
);

export default User;
