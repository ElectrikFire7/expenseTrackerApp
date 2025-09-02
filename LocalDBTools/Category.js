export async function addCategory(db, category, tokens, account) {
    try {
        const result = await db.runAsync(
            'INSERT INTO categoriesTable (Category, Tokens, Account) VALUES (?, ?, ?)',
            [category, tokens, account]
        )
        return {
            success: true,
            message: 'Category created successfully',
            categoryID: result.lastInsertRowId,
        }
    } catch (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
            return { success: false, message: 'Category already exists' }
        } else {
            console.error('Error adding category:', err)
        }
        return { success: false, message: 'Error adding category' }
    }
}

export async function deleteCategory(db, categoryID) {
    const result = await db.runAsync(
        'DELETE FROM categoriesTable WHERE CategoryID = ?',
        [categoryID]
    )

    if (result.changes === 0) {
        return {
            success: false,
            message: `Category with ID '${categoryID}' not found`,
        }
    } else {
        return {
            success: true,
            message: `Category with ID '${categoryID}' deleted`,
        }
    }
}

export async function getAllCategories(db, account) {
    const result = await db.getAllAsync(
        'SELECT * FROM categoriesTable WHERE Account = ?',
        [account]
    )
    return result
}
