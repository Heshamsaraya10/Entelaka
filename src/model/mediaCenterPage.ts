import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { sequelize } from "../databaseConfig/database";

interface mediaPageAttributes {
  id?: number;
  header: {
    images: string[];
    text: string;
  };

  event: {
    images: string;
    h1: string;
    h2: string;
  };
  Gallery: {
    image: string;
    title: string;
    date: Date;
  };
  Videos: {
    vedio: string;
    title: string;
  };
}

class MediaPage
  extends Model<mediaPageAttributes>
  implements mediaPageAttributes
{
  public id!: number;
  public header!: {
    images: string[];
    text: string;
  };
  public event!: {
    images: string;
    h1: string;
    h2: string;
  };
  public Gallery!: {
    image: string;
    title: string;
    date: Date;
  };
  public Videos!: {
    vedio: string;
    title: string;
  };
}

MediaPage.init(
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
    event: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    Gallery: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    Videos: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "mediaPage",
  }
);

export default MediaPage;
