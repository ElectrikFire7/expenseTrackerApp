import { getDB } from '../SetUpDB'
import { addTag } from '../Tags'

export async function parseForAllCategoriesAllTransactions() {
    const db = await getDB()
    const categories = await db.getAllAsync('SELECT * FROM categoriesTable')

    const transactionStrings = await db.getAllAsync(
        'SELECT TransactionString FROM transactionsTable'
    )

    for (const transactionString of transactionStrings) {
        for (const category of categories) {
            const tagStrings = category.tagStrings
                ? category.tagStrings.split(' ')
                : []
            for (const tagString of tagStrings) {
                if (
                    transactionString.TransactionString.toLowerCase().includes(
                        tagString.toLowerCase()
                    )
                ) {
                    await addTag(
                        category.category,
                        transactionString.TransactionString
                    )
                }
            }
        }
    }
}

export async function parseAllTransactionsForGivenCategory(category) {
    const db = await getDB()
    const transactionStrings = await db.getAllAsync(
        'SELECT TransactionString FROM transactionsTable'
    )

    for (const transactionString of transactionStrings) {
        const tagStrings = category.tagStrings
            ? category.tagStrings.split(' ')
            : []
        for (const tagString of tagStrings) {
            if (
                transactionString.TransactionString.toLowerCase().includes(
                    tagString.toLowerCase()
                )
            ) {
                await addTag(
                    category.category,
                    transactionString.TransactionString
                )
            }
        }
    }
}

export async function parseTransactionListForAllCategories(transactionList) {
    const db = await getDB()
    const categories = await db.getAllAsync('SELECT * FROM categoriesTable')

    for (const transactionString of transactionList) {
        let response = await db.getAllAsync(
            'SELECT * FROM transactionsTable WHERE TransactionString = ?',
            [transactionString]
        )
        if (response.length > 0) {
            for (const category of categories) {
                const tagStrings = category.tagStrings
                    ? category.tagStrings.split(' ')
                    : []
                for (const tagString of tagStrings) {
                    if (
                        transactionString
                            .toLowerCase()
                            .includes(tagString.toLowerCase())
                    ) {
                        await addTag(category.category, transactionString)
                    }
                }
            }
        }
    }
}
