import * as SQLite from 'expo-sqlite'
import { getDB } from './SetUpDB'

export async function addCategory(category, tagStrings) {
    const db = await getDB()
    try {
        await db.runAsync(
            'INSERT INTO categoriesTable (Category, Tokens) VALUES (?, ?)',
            [category, tagStrings]
        )
        return { success: true, message: 'Category created successfully' }
    } catch (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
            return { success: false, message: 'Category already exists' }
        } else {
            console.error('Error adding category:', err)
        }
        return { success: false, message: 'Error adding category' }
    }
}

export async function updateCategory(category, newTagStrings) {
    const db = await getDB()
    const result = await db.runAsync(
        'UPDATE categoriesTable SET Tokens = ? WHERE Category = ?',
        [newTagStrings, category]
    )

    if (result.changes === 0) {
        console.log(`Category '${category}' not found`)
    } else {
        console.log(`Category '${category}' updated`)
    }
}

export async function deleteCategory(category) {
    const db = await getDB()
    const result = await db.runAsync(
        'DELETE FROM categoriesTable WHERE Category = ?',
        [category]
    )

    if (result.changes === 0) {
        return { success: false, message: `Category '${category}' not found` }
    } else {
        return { success: true, message: `Category '${category}' deleted` }
    }
}

export async function getAllCategories() {
    const db = await getDB()
    const result = await db.getAllAsync('SELECT * FROM categoriesTable')
    return result
}
