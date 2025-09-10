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
    try {
        const result = await db.getAllAsync(
            `SELECT c.*
             FROM tagsTable t
             INNER JOIN categoriesTable c ON t.CategoryID = c.CategoryID
             WHERE t.TransactionID = ?`,
            [transactionID]
        )
        return result
    } catch (error) {
        console.error('Error fetching categories for transaction:', error)
        return []
    }
}

export async function getTransactionsGivenCategoryFiltered(
    db,
    categoryID,
    account,
    filterText
) {
    try {
        if (categoryID.toString().toLowerCase() === 'uncategorized') {
            const result = await db.getAllAsync(
                `
            SELECT t.*
            FROM transactionsTable t
            LEFT JOIN tagsTable tg
                ON t.TransactionID = tg.TransactionID
            WHERE t.Account = ?
              AND tg.CategoryID IS NULL
            ${filterText ? 'AND t.Date LIKE ?' : ''}
        ORDER BY t.Date DESC
        `,
                [account, `%${filterText}%`]
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
        ${filterText ? 'AND t.Date LIKE ?' : ''}
        ORDER BY t.Date DESC
        `,
            [categoryID, `%${filterText}%`]
        )
        return result
    } catch (error) {
        console.error('Error fetching filtered transactions:', error)
        return []
    }
}

export async function deleteTag(db, transactionID, categoryID) {
    try {
        const result = await db.runAsync(
            `DELETE FROM tagsTable WHERE TransactionID = ? AND CategoryID = ?`,
            [transactionID, categoryID]
        )

        if (result.changes === 0) {
            return {
                success: false,
                message: `Tag with TransactionID '${transactionID}' and CategoryID '${categoryID}' not found`,
            }
        } else {
            return {
                success: true,
                message: `Tag successfully deleted`,
            }
        }
    } catch (err) {
        console.error('Error deleting tag:', err, transactionID, categoryID)
        return { success: false, message: `Error deleting tag: ${err.message}` }
    }
}
