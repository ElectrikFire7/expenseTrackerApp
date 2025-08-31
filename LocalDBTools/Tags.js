import * as SQLite from 'expo-sqlite'
import { getDB } from './SetUpDB'

export async function addTag(category, transactionString) {
    const db = await getDB()
    try {
        await db.runAsync(
            'INSERT INTO tagsTable (Category, TransactionString) VALUES (?, ?)',
            [category, transactionString]
        )
        return { success: true, message: 'Tag added successfully' }
    } catch (err) {
        if (err.message && err.message.includes('UNIQUE constraint failed')) {
            return {
                success: false,
                message:
                    'Tag already exists for this category and transaction.',
            }
        }
        console.error('Error adding tag:', err, transactionString, category)
        return { success: false, message: `Error adding tag: ${err.message}` }
    }
}

export async function getTransactionsGivenCategory(category) {
    const db = await getDB()

    if (category.toLowerCase() === 'uncategorized') {
        const result = await db.getAllAsync(
            `SELECT * FROM transactionsTable WHERE TransactionString NOT IN (
                SELECT TransactionString FROM tagsTable
            )
            ORDER BY Date DESC`
        )
        return result
    }

    const result = await db.getAllAsync(
        `SELECT * FROM transactionsTable WHERE TransactionString IN (
            SELECT TransactionString FROM tagsTable WHERE Category = ?
        )
        ORDER BY Date DESC`,
        [category]
    )
    return result
}

export async function getCategoryGivenTransaction(TransactionString) {
    const db = await getDB()
    const result = await db.getAllAsync(
        `SELECT Category FROM tagsTable WHERE TransactionString = ?`,
        [TransactionString]
    )
    return result
}
