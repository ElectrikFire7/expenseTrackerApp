import { getDB } from './SetUpDB'

export async function addTransaction(
    transactionString,
    date,
    amount,
    debited,
    transactionID = null,
    recipient = null
) {
    const db = await getDB()
    try {
        await db.runAsync(
            `INSERT INTO transactionsTable 
        (TransactionString, Date, Amount, Debited, TransactionID, Recipient) 
       VALUES (?, ?, ?, ?, ?, ?)`,
            [
                transactionString,
                date,
                amount,
                debited ? 1 : 0,
                transactionID,
                recipient,
            ]
        )
        return { success: true, message: 'Transaction added successfully' }
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

export async function updateTransaction(
    transactionString,
    newDate,
    newAmount,
    newDebited,
    newTransactionID = null,
    newRecipient = null
) {
    const db = await getDB()
    const result = await db.runAsync(
        `UPDATE transactionsTable 
     SET Date = ?, Amount = ?, Debited = ?, TransactionID = ?, Recipient = ? 
     WHERE TransactionString = ?`,
        [
            newDate,
            newAmount,
            newDebited ? 1 : 0,
            newTransactionID,
            newRecipient,
            transactionString,
        ]
    )

    if (result.changes === 0) {
        console.log(`Transaction '${transactionString}' not found`)
    } else {
        console.log(`Transaction '${transactionString}' updated`)
    }
}

export async function deleteTransaction(transactionString) {
    const db = await getDB()
    const result = await db.runAsync(
        `DELETE FROM transactionsTable WHERE TransactionString = ?`,
        [transactionString]
    )

    if (result.changes === 0) {
        return {
            success: false,
            message: `Transaction '${transactionString}' not found`,
        }
    } else {
        return {
            success: true,
            message: `Transaction '${transactionString}' deleted`,
        }
    }
}
