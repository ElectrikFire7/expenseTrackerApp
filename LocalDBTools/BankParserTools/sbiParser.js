import { addTransaction } from '../Transaction'
import { parseTransactionForAllCategories } from '../storedParserTools/TagTransactions'

export async function parseSBICSV(csvData, account) {
    const lines = csvData.split(/\r?\n/)

    const headerIndex = lines.findIndex((line) => {
        const lower = line.toLowerCase()
        return (
            lower.includes('txn date') &&
            lower.includes('value date') &&
            lower.includes('description') &&
            lower.includes('ref no./cheque no.') &&
            lower.includes('debit') &&
            lower.includes('credit')
        )
    })

    if (headerIndex === -1) {
        return {
            success: false,
            message: 'Failed: Are you sure this is a valid SBI CSV file?',
        }
    }
    const tableLines = lines.slice(headerIndex + 1)

    const blankIndex = tableLines.findIndex(
        (line) => line.trim() === '' || /^,+$/.test(line)
    )

    if (blankIndex == -1) {
        return {
            success: false,
            message: 'Failed: Are you sure this is a valid SBI CSV file?',
        }
    }

    const onlyTableLines = tableLines.slice(0, blankIndex)

    for (const line of onlyTableLines) {
        if (!line.trim()) continue

        const parsedline = parseSBILine(line)

        if (
            !parsedline &&
            !parsedline?.description &&
            !parsedline?.date &&
            !parsedline?.amount
        )
            continue

        let response = await addTransaction(
            parsedline.description,
            parsedline.date,
            parsedline.amount,
            parsedline.isDebit,
            account
        )
        if (response.success) {
            await parseTransactionForAllCategories(
                response.transactionID,
                account
            )
        }
    }

    return { success: true, message: 'SBI CSV parsed successfully' }
}

function parseSBILine(line) {
    if (!line.trim()) return null

    // Match two dates at the start (txnDate + valueDate)
    const dateRegex = /^(\d{1,2}\s\w{3}\s\d{4})\s+(\d{1,2}\s\w{3}\s\d{4})\s+/
    const match = line.match(dateRegex)

    if (!match) return null

    const rawDate = match[1]

    // Convert to yyyy-mm-dd
    const months = {
        Jan: '01',
        Feb: '02',
        Mar: '03',
        Apr: '04',
        May: '05',
        Jun: '06',
        Jul: '07',
        Aug: '08',
        Sep: '09',
        Oct: '10',
        Nov: '11',
        Dec: '12',
    }
    const [day, mon, year] = rawDate.split(' ')
    const date = `${year}-${months[mon]}-${day.padStart(2, '0')}`

    // Remove the matched part
    let rest = line.replace(dateRegex, '').trim()

    // Split into parts
    const parts = rest.split(/\s+/)

    // Drop balance (last element)
    parts.pop()

    // Amount is now last
    const amount = parseFloat(parts.pop().replace(/,/g, ''))

    // Remaining is description
    let description = parts.join(' ')

    let isDebit = 1
    if (
        description.toUpperCase().startsWith('BY') ||
        description.toUpperCase().includes('CREDIT')
    ) {
        isDebit = 0
    }

    if (/^TO TRANSFER-+/i.test(description)) {
        description = description.replace(/^TO TRANSFER-+/, '').trim()
    } else if (/^BY TRANSFER-+/i.test(description)) {
        description = description.replace(/^BY TRANSFER-+/, '').trim()
    } else if (/^CREDIT INTEREST-+/i.test(description)) {
        description = description.replace(/-+$/, '').trim()
        description = `${date} ${description}`
    }

    description = description.replace(/\s*--.*$/, '').trim()

    return { date, description, amount, isDebit }
}
