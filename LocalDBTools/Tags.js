export async function addTag(db, categoryID, transactionID) {
    try {
        await db.runAsync(
            'INSERT INTO tagsTable (CategoryID, TransactionID) VALUES (?, ?)',
            [categoryID, transactionID]
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
        console.error('Error adding tag:', err, transactionID, categoryID)
        return { success: false, message: `Error adding tag: ${err.message}` }
    }
}

export async function getTransactionsGivenCategory(db, categoryID, account) {
    if (categoryID.toString().toLowerCase() === 'uncategorized') {
        const result = await db.getAllAsync(
            `
            SELECT t.*
            FROM transactionsTable t
            LEFT JOIN tagsTable tg
                ON t.TransactionID = tg.TransactionID
            WHERE t.Account = ?
              AND tg.CategoryID IS NULL
            ORDER BY t.Date DESC
            `,
            [account]
        )
        return result
    }

    const result = await db.getAllAsync(
        `
        SELECT t.*
        FROM transactionsTable t
        INNER JOIN tagsTable tg
            ON t.TransactionID = tg.TransactionID
        WHERE tg.CategoryID = ?
        ORDER BY t.Date DESC
        `,
        [categoryID]
    )
    return result
}

export async function getCategoryGivenTransaction(db, transactionID) {
    const result = await db.getAllAsync(
        `SELECT Category FROM tagsTable WHERE TransactionID = ?`,
        [transactionID]
    )
    return result
}
