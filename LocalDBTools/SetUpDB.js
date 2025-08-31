import * as SQLite from 'expo-sqlite'

let dbInstance = null

export async function getDB() {
    if (!dbInstance) {
        dbInstance = await SQLite.openDatabaseAsync('dataDB')
        await dbInstance.execAsync('PRAGMA foreign_keys = ON;')
    }
    return dbInstance
}

export async function setUpDB() {
    const db = await getDB()

    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS transactionsTable(
            TransactionString TEXT PRIMARY KEY NOT NULL,
            Date TEXT,
            Amount REAL,
            Debited INTEGER,
            TransactionID TEXT,
            Recipient TEXT,
            RecipientBank TEXT
        );

        CREATE TABLE IF NOT EXISTS categoriesTable(
            Category TEXT PRIMARY KEY NOT NULL,
            Tokens TEXT
        );

        CREATE TABLE IF NOT EXISTS tagsTable(
            Category TEXT NOT NULL,
            TransactionString TEXT NOT NULL,
            PRIMARY KEY (Category, TransactionString),
            FOREIGN KEY (TransactionString) REFERENCES transactionsTable(TransactionString) ON DELETE CASCADE,
            FOREIGN KEY (Category) REFERENCES categoriesTable(Category) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS userTable(
            Username TEXT PRIMARY KEY NOT NULL
        )
    `)

    return true
}

export async function getDBInfo() {
    const db = await getDB()

    const tables = await db.getAllAsync(
        "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
    )

    const categories = await db.getAllAsync('SELECT * FROM categoriesTable')
    const transactions = await db.getAllAsync('SELECT * FROM transactionsTable')
    const tags = await db.getAllAsync('SELECT * FROM tagsTable')
    const users = await db.getAllAsync('SELECT * FROM userTable')
    console.log('Categories Table Entries:', categories.length, categories)
    console.log('Transactions Table Entries:', transactions.length)
    console.log('Tags Table Entries:', tags.length)
    console.log('Users Table Entries:', users.length, users)
    return tables
}

export async function dropTable() {
    const db = await getDB()
    await db.execAsync(`DROP TABLE IF EXISTS userTable;`)
    return true
}
