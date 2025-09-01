import { getDB } from '../SetUpDB'
import { addTag } from '../Tags'
import { findMatches } from '../../utils/findTokenMatches'

export async function parseAllTransactionsForGivenCategory(
    categoryID,
    account
) {
    try {
        const db = await getDB()
        const transactionsList = await db.getAllAsync(
            'SELECT * FROM transactionsTable WHERE Account = ?',
            [account]
        )
        const categoryList = await db.getAllAsync(
            'SELECT * FROM categoriesTable WHERE CategoryID = ?',
            [categoryID]
        )
        const category = categoryList[0]

        for (const transaction of transactionsList) {
            const tokens = category.Tokens
                ? category.Tokens.split(' ').map((token) => token.toLowerCase())
                : []
            let matches = findMatches(
                transaction.TransactionString.toLowerCase(),
                tokens
            )
            console.log('input: ', transaction.TransactionString, tokens)
            console.log(`Matches for category ${category.CategoryID}:`, matches)
            if (matches.size > 0) {
                await addTag(category.CategoryID, transaction.TransactionID)
            }

            // for (const token of tokens) {
            //     if (
            //         transaction.TransactionString.toLowerCase().includes(
            //             token.toLowerCase()
            //         )
            //     ) {
            //         await addTag(category.CategoryID, transaction.TransactionID)
            //     }
            // }
        }
    } catch (err) {
        console.error('Error parsing transactions for category:', err)
    }
}

export async function parseTransactionForAllCategories(transactionID, account) {
    const db = await getDB()
    const categories = await db.getAllAsync(
        'SELECT * FROM categoriesTable WHERE Account = ?',
        [account]
    )

    const transactionList = await db.getAllAsync(
        'SELECT * FROM transactionsTable WHERE TransactionID = ?',
        [transactionID]
    )

    const transaction = transactionList[0]

    for (const category of categories) {
        const tokens = category.Tokens
            ? category.Tokens.split(' ').map((token) => token.toLowerCase())
            : []
        let matches = findMatches(
            transaction.TransactionString.toLowerCase(),
            tokens
        )
        console.log('input: ', transaction.TransactionString, tokens)
        console.log(`Matches for category ${category.CategoryID}:`, matches)
        if (matches.size > 0) {
            await addTag(category.CategoryID, transaction.TransactionID)
        }
        // for (const token of tokens) {
        //     if (
        //         transaction.TransactionString.toLowerCase().includes(
        //             token.toLowerCase()
        //         )
        //     ) {
        //         await addTag(category.CategoryID, transaction.TransactionID)
        //     }
        // }
    }
}
