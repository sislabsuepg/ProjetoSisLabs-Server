import {
  Table,
  Model,
  PrimaryKey,
  Column,
  DataType,
} from "sequelize-typescript";
interface ReseterAtributos {
  id: number;
  lastReset: Date;
}

interface ReseterCreationAtributos {}

@Table({
  tableName: "reseter",
  modelName: "Reseter",
  timestamps: false,
})
export default class Reseter extends Model<
  ReseterAtributos,
  ReseterCreationAtributos
> {
  @PrimaryKey
  @Column({ type: DataType.INTEGER })
  declare id: number;

  @Column({ type: DataType.DATE })
  declare lastReset: Date;
}
