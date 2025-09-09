import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native'
import * as DocumentPicker from 'expo-document-picker'
import * as FileSystem from 'expo-file-system'
import { useSQLiteContext } from 'expo-sqlite'
import { StyleSheet } from 'react-native'
import { parseICICICSV } from '../LocalDBTools/BankParserTools/iciciParser.js'
import { parseSBICSV } from '../LocalDBTools/BankParserTools/sbiParser.js'
import { addTransaction } from '../LocalDBTools/Transaction.js'
import { parseTransactionForAllCategories } from '../LocalDBTools/storedParserTools/TagTransactions.js'
import DropDownPicker from 'react-native-dropdown-picker'
import accountStore from '../Store/accountStore.js'
import masterStyles from '../Styles/StylesMaster.js'

const AddTransaction = ({ navigation }) => {
    const account = accountStore((state) => state.currentAccount)
    const db = useSQLiteContext()
    const [transactionString, setTransactionString] = useState('')
    const [date, setDate] = useState('')
    const [amountString, setAmountString] = useState('')
    const [isDebit, setIsDebit] = useState(true)
    const [file, setFile] = useState(null)
    const [openDropdown, setOpenDropdown] = useState(false)
    const [bank, setBank] = useState(null)
    const [items, setItems] = useState([
        { label: 'ICICI', value: 'ICICI' },
        { label: 'SBI', value: 'SBI' },
    ])

    const pickCSV = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: [
                    'text/csv',
                    'application/csv',
                    'text/comma-separated-values',
                    'text/plain',
                    'application/vnd.ms-excel',
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                ],
                copyToCacheDirectory: true,
            })
            const file = result.assets[0]
            setFile(file)
        } catch (err) {
            console.log('Error reading CSV:', err)
        }
    }

    const parseCSV = async (fileVar) => {
        if (!fileVar) {
            Alert.alert('No file selected')
            return
        }
        if (!bank) {
            Alert.alert('No bank selected')
            return
        }

        try {
            const fileText = await FileSystem.readAsStringAsync(fileVar.uri)
            if (bank === 'ICICI') {
                const result = await parseICICICSV(db, fileText, account)
                Alert.alert(result.message)
            } else if (bank === 'SBI') {
                const result = await parseSBICSV(db, fileText, account)
                Alert.alert(result.message)
            }

            setFile(null)
            setBank(null)
        } catch (err) {
            console.error('Error parsing CSV:', err)
        }
    }

    const addNewTransaction = async () => {
        if (!transactionString.trim() || !date.trim() || !amountString.trim()) {
            alert('Please fill in all fields.')
            return
        }
        const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/
        if (!dateRegex.test(date.trim())) {
            alert('Date must be in yyyy-mm-dd format.')
            return
        }
        if (isNaN(parseFloat(amountString))) {
            alert('Amount must be a valid number.')
            return
        }
        let result = await addTransaction(
            db,
            transactionString,
            date,
            parseFloat(amountString),
            isDebit,
            account
        )
        if (result.success) {
            let result2 = parseTransactionForAllCategories(
                db,
                result.transactionID,
                account
            )
        }
        alert(result.message)
        setTransactionString('')
        setDate('')
        setAmountString('')
        setIsDebit(true)
    }

    return (
        <>
            {account == null ? (
                <View style={masterStyles.emptyData}>
                    <Text style={masterStyles.emptyDataText}>
                        Select an account to use this page
                    </Text>
                </View>
            ) : (
                <View style={masterStyles.screenContainer}>
                    <View style={masterStyles.headerBar}>
                        <Text style={masterStyles.header}>
                            Add New Transaction
                        </Text>
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            value={transactionString}
                            onChangeText={(text) => setTransactionString(text)}
                            placeholder="* Enter the whole transaction detail uri"
                            placeholderTextColor="#858585ff"
                        />
                        <TextInput
                            style={styles.input}
                            value={date}
                            onChangeText={(text) => setDate(text)}
                            placeholder="* Enter the date (yyyy-mm-dd)"
                            placeholderTextColor="#858585ff"
                        />

                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            value={amountString}
                            onChangeText={(text) => setAmountString(text)}
                            placeholder="* Enter the amount"
                            placeholderTextColor="#858585ff"
                        />

                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginVertical: 8,
                            }}
                        >
                            <Text style={styles.type}>Type: </Text>
                            <TouchableOpacity
                                style={{
                                    marginHorizontal: 8,
                                    borderRadius: 50,
                                    borderWidth: 1,
                                    backgroundColor: isDebit ? 'red' : 'green',
                                    paddingHorizontal: 20,
                                    paddingVertical: 4,
                                }}
                                onPress={() => setIsDebit(!isDebit)}
                            >
                                <Text>{isDebit ? 'Debit' : 'Credit'}</Text>
                            </TouchableOpacity>
                            <Text style={styles.hint}>click to change</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={addNewTransaction}
                        style={styles.addTransaction}
                    >
                        <Text style={{ fontWeight: 'bold', color: '#fff' }}>
                            Add Transaction
                        </Text>
                    </TouchableOpacity>
                    <View style={masterStyles.headerBar}>
                        <Text style={masterStyles.header}>
                            Add Bank Statement .csv/xlsx
                        </Text>
                    </View>
                    <View style={styles.inputContainer}>
                        <DropDownPicker
                            open={openDropdown}
                            value={bank}
                            items={items}
                            setOpen={setOpenDropdown}
                            setValue={setBank}
                            setItems={setItems}
                            placeholder="Select a bank"
                        />
                        <TouchableOpacity
                            style={{
                                marginVertical: 8,
                                paddingVertical: 12,
                                paddingHorizontal: 12,
                                width: '30%',
                                borderRadius: 10,
                                backgroundColor: '#007bff',
                                alignItems: 'center',
                            }}
                            onPress={pickCSV}
                        >
                            <Text style={{ fontWeight: 'bold', color: '#fff' }}>
                                Choose file
                            </Text>
                        </TouchableOpacity>
                        <Text
                            style={{
                                fontWeight: 'bold',
                                color: '#000',
                                paddingLeft: 8,
                            }}
                        >
                            {file ? file.name : 'No file selected'}
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            parseCSV(file)
                        }}
                        style={styles.addTransaction}
                    >
                        <Text style={{ fontWeight: 'bold', color: '#fff' }}>
                            Parse File
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </>
    )
}

const styles = StyleSheet.create({
    inputContainer: {
        width: '90%',
        marginTop: 8,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderRadius: 50,
        marginVertical: 8,
        boxShadow: '2px 4px 2px rgba(0, 0, 0, 0.36)',
        paddingHorizontal: 16,
    },
    type: { fontSize: 16 },
    hint: { fontSize: 12, color: '#0000006c' },
    addTransaction: {
        marginTop: 4,
        marginBottom: 32,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 50,
        backgroundColor: '#007bff',
    },
})

export default AddTransaction
