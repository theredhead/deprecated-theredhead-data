/** @format */

import { SQLiteConnection } from "../../../src/data/sqlite";

describe("SQLiteConnection", () => {
  it("can be created", () => {
    const cn = new SQLiteConnection({ connectionString: ":memory:" });
    const cmd = cn.createCommand("SELECT CURRENT_TIMESTAMP", []);
    expect(cmd.commandText).toBe("SELECT CURRENT_TIMESTAMP");
  });

  it("can select a timestamp", async () => {
    const cn = new SQLiteConnection({ connectionString: ":memory:" });
    const cmd = cn.createCommand("SELECT CURRENT_TIMESTAMP", []);

    cn.open();
    const result = await cmd.exectute();
    expect(result.affectedRows).toBe(1);
    cn.close();
  });
});
