export async function fetchAllTransactionsFullYearData(db, account, year) {
    try {
        const results = await db.getAllAsync(
            `
            WITH months(m) AS (
                VALUES 
                    ('01'), ('02'), ('03'), ('04'), ('05'), ('06'),
                    ('07'), ('08'), ('09'), ('10'), ('11'), ('12')
            )
            SELECT 
                m.m AS Month,
                IFNULL(SUM(CASE 
                    WHEN CAST(t.Debited AS INTEGER) = 1 
                    THEN t.Amount END), 0) AS TotalExpense,
                IFNULL(SUM(CASE 
                    WHEN CAST(t.Debited AS INTEGER) = 0 
                    THEN t.Amount END), 0) AS TotalIncome
            FROM months m
            LEFT JOIN transactionsTable t
                ON strftime('%m', t.Date) = m.m
            AND strftime('%Y', t.Date) = ?
            AND t.Account = ?
            GROUP BY m.m
            ORDER BY m.m;
            `,
            [year, account]
        )

        return results
    } catch (error) {
        console.error('Error fetching transactions data:', error)
        return []
    }
}

export async function fetchCategoryTransactionsFullYearData(
    db,
    account,
    year,
    categoryID
) {
    try {
        const results = await db.getAllAsync(
            `
            WITH months(m) AS (
                VALUES 
                    ('01'), ('02'), ('03'), ('04'), ('05'), ('06'),
                    ('07'), ('08'), ('09'), ('10'), ('11'), ('12')
            )
            SELECT 
                m.m AS Month,
                IFNULL(SUM(CASE 
                    WHEN tg.CategoryID = ? AND CAST(t.Debited AS INTEGER) = 1 
                    THEN t.Amount END), 0) AS TotalExpense,
                IFNULL(SUM(CASE 
                    WHEN tg.CategoryID = ? AND CAST(t.Debited AS INTEGER) = 0 
                    THEN t.Amount END), 0) AS TotalIncome
            FROM months m
            LEFT JOIN transactionsTable t
                ON strftime('%m', t.Date) = m.m
               AND strftime('%Y', t.Date) = ?
               AND t.Account = ?
            LEFT JOIN tagsTable tg
                ON tg.TransactionID = t.TransactionID
            GROUP BY m.m
            ORDER BY m.m;
            `,
            [categoryID, categoryID, year, account]
        )

        return results
    } catch (error) {
        console.error('Error fetching category transactions data:', error)
        return []
    }
}

export async function fetchUncategorizedTransactionsFullYearData(
    db,
    account,
    year
) {
    try {
        const results = await db.getAllAsync(
            `
            WITH months(m) AS (
                VALUES 
                    ('01'), ('02'), ('03'), ('04'), ('05'), ('06'),
                    ('07'), ('08'), ('09'), ('10'), ('11'), ('12')
            )
            SELECT 
                m.m AS Month,
                IFNULL(SUM(CASE 
                    WHEN tg.CategoryID IS NULL AND CAST(t.Debited AS INTEGER) = 1 
                    THEN t.Amount END), 0) AS TotalExpense,
                IFNULL(SUM(CASE 
                    WHEN tg.CategoryID IS NULL AND CAST(t.Debited AS INTEGER) = 0 
                    THEN t.Amount END), 0) AS TotalIncome
            FROM months m
            LEFT JOIN transactionsTable t
                ON strftime('%m', t.Date) = m.m
               AND strftime('%Y', t.Date) = ?
               AND t.Account = ?
            LEFT JOIN tagsTable tg
                ON tg.TransactionID = t.TransactionID
            GROUP BY m.m
            ORDER BY m.m;
            `,
            [year, account]
        )

        return results
    } catch (error) {
        console.error('Error fetching uncategorized transactions data:', error)
        return []
    }
}
