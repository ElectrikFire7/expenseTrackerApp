import { getDB } from './SetUpDB'

export async function addUser(username) {
    try {
        const db = await getDB()
        await db.runAsync(
            `
            INSERT INTO userTable (Username) VALUES (?);
        `,
            [username]
        )
        return { success: true, message: 'User added successfully' }
    } catch (error) {
        console.error('Error adding user:', error)
        if (
            error.message.includes('UNIQUE constraint failed') ||
            error.message.includes('PRIMARY KEY constraint failed')
        ) {
            return { success: false, message: 'User already exists' }
        } else {
            return {
                success: false,
                message: `Error adding user: ${error.message}`,
            }
        }
    }
}

export async function getAllUsers() {
    try {
        const db = await getDB()
        const users = await db.getAllAsync('SELECT * FROM userTable')
        return users
    } catch (error) {
        console.error('Error getting all users:', error)
        throw error
    }
}

export async function deleteUser(username) {
    try {
        const db = await getDB()
        const result = await db.runAsync(
            `
            DELETE FROM userTable WHERE Username = ?;
        `,
            [username]
        )

        if (result.changes > 0) {
            return { success: true, message: 'User deleted successfully' }
        } else {
            return { success: false, message: 'User not found' }
        }
    } catch (error) {
        return {
            success: false,
            message: `Error deleting user: ${error.message}`,
        }
    }
}
