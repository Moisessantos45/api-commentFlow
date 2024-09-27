import { QueryTypes } from "sequelize";
import dbInstance from "./connexion";

const createViews = async (tableName: string, newNameTable: string) => {
  try {
    await dbInstance.query(
      `CREATE OR REPLACE VIEW ${newNameTable} AS
            SELECT * FROM ${tableName} WHERE status = :newValue;`,
      {
        replacements: {
          newValue: "active",
        },
        type: QueryTypes.RAW,
      }
    );
  } catch (error) {
    console.log(error);
  }
};

export { createViews };
