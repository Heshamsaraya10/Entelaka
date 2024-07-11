import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { sequelize } from "../databaseConfig/database";
import User from "./userModel";

interface AboutpageAttributes {
  id?: number;
  header: {
    images: string[];
    text: string;
  };
  description: string;
  footer?: {
    aboutUs: string[];
    Accelerator: string[];
    ThinkTank: string[];
    Projects: string[];
    MediaCenter: string[];
    ContactUs: string[];
    socialMedia: string;
  }[];
  userId: number;
}

class AboutPage
  extends Model<AboutpageAttributes>
  implements AboutpageAttributes
{
  public id?: number;
  public description!: string;
  public header!: {
    images: string[];
    text: string;
  };
  public footer!: {
    aboutUs: string[];
    Accelerator: string[];
    ThinkTank: string[];
    Projects: string[];
    MediaCenter: string[];
    ContactUs: string[];
    socialMedia: string;
  }[];
  public userId!: number;
}
AboutPage.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    header: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    footer: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "AboutPage",
  }
);

User.belongsTo(AboutPage, { foreignKey: "userId", onDelete: "CASCADE" });
AboutPage.hasMany(User, { foreignKey: "userId", onDelete: "CASCADE" });

export default AboutPage;
