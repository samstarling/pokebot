import { Model } from "sequelize";

module.exports = (sequelize, DataTypes) => {
  class Roll extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Roll.init(
    {
      userId: DataTypes.STRING,
      teamId: DataTypes.STRING,
      pokemonNumber: DataTypes.NUMBER,
      createdAt: DataTypes.TIME,
    },
    {
      sequelize,
      modelName: "Roll",
    }
  );
  return Roll;
};
