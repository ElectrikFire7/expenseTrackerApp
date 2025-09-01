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
        CREATE TABLE IF NOT EXISTS accountsTable(
            Account TEXT PRIMARY KEY NOT NULL
        );
        
        CREATE TABLE IF NOT EXISTS transactionsTable(
            TransactionID INTEGER PRIMARY KEY AUTOINCREMENT,
            TransactionString TEXT NOT NULL,
            Date TEXT NOT NULL,
            Amount REAL NOT NULL,
            Debited INTEGER NOT NULL,
            TransactionGivenID TEXT,
            Recipient TEXT,
            RecipientBank TEXT,
            Account TEXT NOT NULL,
            FOREIGN KEY (Account) REFERENCES accountsTable (Account) ON DELETE CASCADE,
            UNIQUE (TransactionString, Account)
        );

        CREATE TABLE IF NOT EXISTS categoriesTable(
            CategoryID INTEGER PRIMARY KEY AUTOINCREMENT,
            Category TEXT NOT NULL,
            Tokens TEXT,
            Account TEXT NOT NULL,
            FOREIGN KEY (Account) REFERENCES accountsTable(Account) ON DELETE CASCADE,
            UNIQUE (Account, Category)
        );

        CREATE TABLE IF NOT EXISTS tagsTable(
            CategoryID INTEGER NOT NULL,
            TransactionID INTEGER NOT NULL,
            PRIMARY KEY (CategoryID, TransactionID),
            FOREIGN KEY (TransactionID) REFERENCES transactionsTable(TransactionID) ON DELETE CASCADE,
            FOREIGN KEY (CategoryID) REFERENCES categoriesTable(CategoryID) ON DELETE CASCADE
        );
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
    const accounts = await db.getAllAsync('SELECT * FROM accountsTable')
    console.log('Categories Table Entries:', categories.length, categories)
    console.log('Transactions Table Entries:', transactions.length)
    console.log('Tags Table Entries:', tags.length, tags)
    console.log('Accounts Table Entries:', accounts.length, accounts)
    return tables
}

export async function dropTable() {
    const db = await getDB()
    await db.execAsync(`DROP TABLE IF EXISTS categoriesTable;`)
    await db.execAsync(`DROP TABLE IF EXISTS transactionsTable;`)
    await db.execAsync(`DROP TABLE IF EXISTS tagsTable;`)
    await db.execAsync(`DROP TABLE IF EXISTS accountsTable;`)
    return true
}
