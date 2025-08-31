import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native'
import * as DocumentPicker from 'expo-document-picker'
import * as FileSystem from 'expo-file-system'
import { StyleSheet } from 'react-native'
import { parseICICICSV } from '../LocalDBTools/BankParserTools/iciciParser.js'
import { addTransaction } from '../LocalDBTools/Transaction.js'
import DropDownPicker from 'react-native-dropdown-picker'
import userStore from '../Store/userStore'

const AddTransaction = ({ navigation }) => {
    if (!userStore.getState().currentUser) {
        return <Text>No user selected/created</Text>
    }
    const [transactionString, setTransactionString] = useState('')
    const [date, setDate] = useState('')
    const [amountString, setAmountString] = useState('')
    const [isDebit, setIsDebit] = useState(true)
    const [file, setFile] = useState(null)
    const [openDropdown, setOpenDropdown] = useState(false)
    const [bank, setBank] = useState(null)
    const [items, setItems] = useState([{ label: 'ICICI', value: 'ICICI' }])

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
            console.error('Error reading CSV:', err)
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
                parseICICICSV(fileText)
            }
        } catch (err) {
            console.error('Error parsing CSV:', err)
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerBar}>
                <Text style={styles.header}>Add New Transaction</Text>
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={transactionString}
                    onChangeText={(text) => setTransactionString(text)}
                    placeholder="* Enter the whole transaction detail uri"
                />
                <TextInput
                    style={styles.input}
                    value={date}
                    onChangeText={(text) => setDate(text)}
                    placeholder="* Enter the date (dd-mm-yyyy)"
                />

                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={amountString}
                    onChangeText={(text) => setAmountString(text)}
                    placeholder="* Enter the amount"
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
                onPress={async () => {
                    if (
                        !transactionString.trim() ||
                        !date.trim() ||
                        !amountString.trim()
                    ) {
                        alert('Please fill in all fields.')
                        return
                    }
                    const dateRegex =
                        /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/
                    if (!dateRegex.test(date.trim())) {
                        alert('Date must be in yyyy-mm-dd format.')
                        return
                    }
                    if (isNaN(parseFloat(amountString))) {
                        alert('Amount must be a valid number.')
                        return
                    }
                    let result = await addTransaction(
                        transactionString,
                        date,
                        parseFloat(amountString),
                        isDebit
                    )
                    alert(result.message)
                    setTransactionString('')
                    setDate('')
                    setAmountString('')
                    setIsDebit(true)
                }}
                style={styles.addTransaction}
            >
                <Text style={{ fontWeight: 'bold', color: '#fff' }}>
                    Add Transaction
                </Text>
            </TouchableOpacity>
            <View style={styles.headerBar}>
                <Text style={styles.header}>Add Bank Statement .csv/xlsx</Text>
            </View>
            <View style={styles.inputContainer}>
                <DropDownPicker
                    open={openDropdown}
                    value={bank}
                    items={items}
                    setOpen={setOpenDropdown}
                    setValue={setBank}
                    setItems={setItems}
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
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    headerBar: {
        marginTop: 50,
        width: '90%',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
    },
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
        marginVertical: 8,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 50,
        backgroundColor: '#007bff',
    },
})

export default AddTransaction
