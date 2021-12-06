# @theredheda/data

this is work in progress.

This package presents an easy to use API for serverside projects to connect to databases.

Supported databases:

- mysql/mariadb (through mysql2)
- sqlite (through sqlite3)

Basic API:

```typescript

const cn = new SQLiteConnection({ connectionString: ":memory:" });
const cmd = cn.createCommand("SELECT CURRENT_TIMESTAMP", []);

cn.open();

const result = await cmd.exectute();
expect(result.affectedRows).toBe(1);

cn.close();

```
