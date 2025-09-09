export async function addTransaction(
    db,
    transactionString,
    date,
    amount,
    debited,
    account,
    transactionGivenID = null,
    recipient = null
) {
    try {
        const result = await db.runAsync(
            `INSERT INTO transactionsTable 
        (TransactionString, Date, Amount, Debited, TransactionGivenID, Recipient, Account) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                transactionString,
                date,
                amount,
                debited ? 1 : 0,
                transactionGivenID,
                recipient,
                account,
            ]
        )
        return {
            success: true,
            message: 'Transaction added successfully',
            transactionID: result.lastInsertRowId,
        }
    } catch (err) {
        if (
            err.message.includes('UNIQUE constraint failed') ||
            err.message.includes('PRIMARY KEY constraint failed')
        ) {
            return { success: false, message: 'Transaction already exists' }
        } else {
            console.error('Error adding transaction:', err, transactionString)
            return {
                success: false,
                message: `Error adding transaction: ${err.message}`,
            }
        }
    }
}

export async function getTransactionWithID(db, transactionID) {
    try {
        const result = await db.getAllAsync(
            `SELECT * FROM transactionsTable WHERE TransactionID = ?`,
            [transactionID]
        )
        return result[0] || null
    } catch (error) {
        console.error('Error fetching transaction:', error)
        return null
    }
}

export async function deleteTransaction(db, transactionID) {
    const result = await db.runAsync(
        `DELETE FROM transactionsTable WHERE TransactionID = ?`,
        [transactionID]
    )

    if (result.changes === 0) {
        return {
            success: false,
            message: `Transaction with ID '${transactionID}' not found`,
        }
    } else {
        return {
            success: true,
            message: `Transaction successfully deleted`,
        }
    }
}
