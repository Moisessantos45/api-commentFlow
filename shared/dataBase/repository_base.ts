import { Model, ModelStatic, QueryTypes } from "sequelize";

export default class ModelRepository<T extends Model> {
  protected model: ModelStatic<T>;
  protected tableName: string;
  protected viewName: string;

  constructor(model: ModelStatic<T>, viewName: string) {
    this.model = model;
    this.tableName = model.tableName;
    this.viewName = viewName;
  }

  async retrieveAll(): Promise<T[]> {
    try {
      const [results] =
        (await this.model.sequelize?.query(
          `SELECT * FROM ${this.viewName} WHERE status = :status`,
          {
            replacements: { status: "active" },
            type: QueryTypes.SELECT,
          }
        )) || [];

      return results as T[];
    } catch (error) {
      return [];
    }
  }

  async retrieveById(
    value: string,
    searchField?: string,
    activeStatus: string = "active"
  ): Promise<T | null> {
    try {
      const fieldToSearch =
        searchField || this.model.primaryKeyAttribute || "id";
      const results = await this.model.sequelize?.query(
        `SELECT * FROM ${this.viewName} WHERE ${fieldToSearch} = :recordId AND status = :activeStatus`,
        {
          replacements: { recordId: value, activeStatus },
          type: QueryTypes.SELECT,
        }
      );

      if (!results?.length) return null;

      return results[0] as T;
    } catch (error) {
      return null;
    }
  }

  async retrieveCountAll(page: number, items: number): Promise<T[]> {
    try {
      const offset = (page - 1) * items;
      const { count, rows } = await this.model.findAndCountAll({
        limit: items,
        offset,
      });
      if (count < 1) {
        return [];
      }

      return rows as T[];
    } catch (error) {
      return [];
    }
  }

  async insert(data: any): Promise<T> {
    try {
      return await this.model.create(data);
    } catch (error) {
      throw new Error("Error inserting record");
    }
  }

  async modify(id: string, data: Partial<T | null>): Promise<number> {
    try {
      if (!data) {
        return 0;
      }
      const setClause = Object.keys(data)
        .map((key) => `${key} = :${key}`)
        .join(", ");

      const primaryKey = this.model.primaryKeyAttribute || "id";

      const [rows] = (await this.model.sequelize?.query(
        `UPDATE ${this.tableName} SET ${setClause} WHERE ${primaryKey} = :recordId`,
        {
          replacements: { ...data, recordId: id },
          type: QueryTypes.UPDATE,
        }
      )) || [0];

      if (typeof rows === "number") {
        return rows;
      }

      return 0;
    } catch (error) {
      return 0;
    }
  }

  async deactivate(id: string, status: string): Promise<number> {
    try {
      const primaryKey = this.model.primaryKeyAttribute || "id";

      const [affectedRows] = (await this.model.sequelize?.query(
        `UPDATE ${this.tableName} SET status = :newStatus WHERE ${primaryKey} = :recordId`,
        {
          replacements: { newStatus: status, recordId: id },
          type: QueryTypes.UPDATE,
        }
      )) || [0];

      if (typeof affectedRows === "number") {
        return affectedRows;
      }

      return 0;
    } catch (error) {
      return 0;
    }
  }
}
