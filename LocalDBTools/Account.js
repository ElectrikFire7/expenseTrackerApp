export async function addAccount(db, account) {
    try {
        await db.runAsync(
            `
            INSERT INTO accountsTable (Account) VALUES (?);
        `,
            [account]
        )
        return { success: true, message: 'Account added successfully' }
    } catch (error) {
        console.error('Error adding account:', error)
        if (
            error.message.includes('UNIQUE constraint failed') ||
            error.message.includes('PRIMARY KEY constraint failed')
        ) {
            return { success: false, message: 'Account already exists' }
        } else {
            return {
                success: false,
                message: `Error adding account: ${error.message}`,
            }
        }
    }
}

export async function getAllAccounts(db) {
    try {
        if (!db) {
            throw new Error('Database not initialized (getDB returned null)')
        }
        const accounts = await db.getAllAsync('SELECT * FROM accountsTable')
        return accounts
    } catch (error) {
        console.error('Error getting all accounts:', error)
        throw error
    }
}

export async function deleteAccount(db, account) {
    try {
        const result = await db.runAsync(
            `
            DELETE FROM accountsTable WHERE Account = ?;
        `,
            [account]
        )

        if (result.changes > 0) {
            return { success: true, message: 'Account deleted successfully' }
        } else {
            return { success: false, message: 'Account not found' }
        }
    } catch (error) {
        return {
            success: false,
            message: `Error deleting account: ${error.message}`,
        }
    }
}
