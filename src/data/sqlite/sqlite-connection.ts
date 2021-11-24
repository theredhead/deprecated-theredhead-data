/** @format */

import { DbCommand } from "../connection/db-command";
import {
  DbCommandArguments,
  DbConnection,
  DbResult,
} from "../connection/db-connection";

import * as sqlite3 from "sqlite3";

export interface SQLiteConnectionOptions {
  connectionString: string;
}

export class SQLiteConnectionError extends Error {}

export class SQLiteConnection extends DbConnection {
  private cn?: sqlite3.Database | null;

  constructor(private readonly options: SQLiteConnectionOptions) {
    super();
  }

  open(): void {
    this.cn = new sqlite3.Database(this.options.connectionString);
  }
  close(): void {
    this.cn = null;
  }

  createCommand(commandText: string, args: DbCommandArguments): DbCommand {
    return new SQLiteCommand(this, commandText, args);
  }
  execute<T>(command: DbCommand): Promise<DbResult<T>> {
    const result: DbResult<T> = {
      affectedRows: -1,
      rows: [],
    };
    const db = this.cn!;
    return new Promise<DbResult<T>>((resolve, reject) => {
      if (this.cn == null) {
        reject(new SQLiteConnectionError("The connection is not open"));
      }
      db.serialize(() => {
        const statement = db.prepare(command.commandText);
        statement.run(command.args);

        statement.all((err, rows) => {
          if (err) throw err;
          if (rows.length) {
            result.affectedRows = rows.length;
            result.rows.push(...rows);
          }
          resolve(result);
        });
      });
    });
  }
}

export class SQLiteCommand extends DbCommand {}
