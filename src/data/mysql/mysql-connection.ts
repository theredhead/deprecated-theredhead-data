/** @format */

import { DbCommand } from "../connection/db-command";
import {
  DbCommandArguments,
  DbConnection,
  DbResult,
} from "../connection/db-connection";

import * as mysql2 from "mysql2";

export interface MySqlConnectionOptions {
  connectionString: string;
}

export class MySqlConnectionError extends Error {}

export class MySqlConnection extends DbConnection {
  private cn?: mysql2.Connection | null;

  constructor(private readonly options: MySqlConnectionOptions) {
    super();
  }

  open(): void {
    this.cn = mysql2.createConnection(this.options.connectionString);
  }
  close(): void {
    this.cn = null;
  }

  createCommand(commandText: string, args: DbCommandArguments): DbCommand {
    return new MySqlCommand(this, commandText, args);
  }
  execute<T>(command: DbCommand): Promise<DbResult<T>> {
    const result: DbResult<T> = {
      affectedRows: -1,
      rows: [],
    };
    const db = this.cn!;
    return new Promise<DbResult<T>>((resolve, reject) => {
      if (this.cn == null) {
        reject(new MySqlConnectionError("The connection is not open"));
      }

      db.execute(command.commandText, command.args, (err, rows) => {
        if (err) throw err;
        if ((<any[]>rows)?.length) {
          result.affectedRows = (<any[]>rows).length;
          result.rows.push(...(<any[]>rows));
        }
        resolve(result);
      });
    });
  }
}

export class MySqlCommand extends DbCommand {}
