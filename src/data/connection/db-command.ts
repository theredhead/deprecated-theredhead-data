/** @format */

import { DbCommandArguments, DbConnection, DbResult } from "./db-connection";

export class DbCommand {
  constructor(
    readonly connection: DbConnection,
    readonly commandText: string,
    readonly args: DbCommandArguments
  ) {}

  exectute<T>(): Promise<DbResult<T>> {
    return this.connection.execute(this);
  }
}
