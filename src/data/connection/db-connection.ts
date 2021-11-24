/** @format */

import { DbCommand } from "./db-command";

export abstract class DbConnection {
  abstract open(): void;
  abstract close(): void;

  abstract createCommand(
    commandText: string,
    args: DbCommandArguments
  ): DbCommand;
  abstract execute<T>(command: DbCommand): Promise<DbResult<T>>;
}

export interface DbResult<T> {
  affectedRows: number;
  rows: T[];
}

export type DbPositionalArguments = any[];
export type DbNamedArguments = { [name: string]: any };
export type DbCommandArguments = DbPositionalArguments | DbNamedArguments;
