import { addTransaction } from '../Transaction'
import { parseTransactionForAllCategories } from '../storedParserTools/TagTransactions'

export async function parseICICICSV(csvData, account) {
    const lines = csvData.split(/\r?\n/)

    const headerIndex = lines.findIndex((line) => {
        const lower = line.toLowerCase()
        return (
            lower.includes('date') &&
            lower.includes('mode') &&
            lower.includes('particular') &&
            lower.includes('deposits') &&
            lower.includes('withdrawals')
        )
    })

    if (headerIndex === -1) {
        return {
            success: false,
            message: 'Failed: Are you sure this is a valid ICICI CSV file?',
        }
    }
    const tableLines = lines.slice(headerIndex + 2)

    const blankIndex = tableLines.findIndex(
        (line) => line.trim() === '' || /^,+$/.test(line)
    )

    if (blankIndex == -1) {
        return {
            success: false,
            message: 'Failed: Are you sure this is a valid ICICI CSV file?',
        }
    }

    const onlyTableLines = tableLines.slice(0, blankIndex)

    for (const line of onlyTableLines) {
        const cols = line.split(',')

        if (cols.length < 5) continue

        // Convert date from dd-mm-yyyy to yyyy-mm-dd
        const [day, month, year] = cols[0].trim().split('-')
        const date = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
        const particulars = cols[2].trim()
        const deposit = parseFloat(cols[3]) || 0
        const withdraw = parseFloat(cols[4]) || 0

        const amount = deposit > 0 ? deposit : withdraw
        const debited = withdraw > 0 ? 1 : 0

        let response = await addTransaction(
            particulars,
            date,
            amount,
            debited,
            account
        )
        if (response.success) {
            await parseTransactionForAllCategories(
                response.transactionID,
                account
            )
        }
    }
    return { success: true, message: 'Transactions parsed successfully' }
}
