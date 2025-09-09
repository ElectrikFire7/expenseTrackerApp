import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Modal } from 'react-native'
import { useSQLiteContext } from 'expo-sqlite'
import accountStore from '../Store/accountStore.js'
import masterStyles from '../Styles/StylesMaster.js'
import DeleteButton from '../Components/DeleteButton.js'
import BackButton from '../Components/BackButton.js'
import {
    getTransactionWithID,
    deleteTransaction,
} from '../LocalDBTools/Transaction.js'
import { getCategoryGivenTransaction, deleteTag } from '../LocalDBTools/Tags.js'
import AddCategoryToTransaction from '../Components/AddCategoryToTransaction.js'

const TransactionInfo = ({ route, navigation }) => {
    if (route?.params?.TransactionID == undefined) {
        navigation.navigate('Main', { screen: 'Categories' })
    }
    const db = useSQLiteContext()
    const transactionID = route.params.TransactionID
    const account = accountStore.getState().currentAccount
    const [transaction, setTransaction] = useState(null)
    const [categories, setCategories] = useState([])
    const [deleteTransactionModalVisible, setDeleteTransactionModalVisible] =
        useState(false)
    const [deleteTagModalVisible, setDeleteTagModalVisible] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState(null)

    const fetchTransactionDetails = async () => {
        const tx = await getTransactionWithID(db, transactionID)
        setTransaction(tx)
        const cats = await getCategoryGivenTransaction(db, transactionID)
        setCategories(cats)
    }

    const handleDeleteTransaction = async (givenTransactionID) => {
        const result = await deleteTransaction(db, givenTransactionID)
        alert(result.message)
        navigation.navigate('Main', { screen: 'Categories' })
    }

    const handleDeleteTag = async (givenTransactionID, givencategoryID) => {
        const result = await deleteTag(db, givenTransactionID, givencategoryID)
        setDeleteTagModalVisible(false)
        alert(result.message)
        fetchTransactionDetails()
        setSelectedCategory(null)
    }

    const handleNewCategoryAdded = () => {
        fetchTransactionDetails() // refreshes transaction + categories
    }

    useEffect(() => {
        fetchTransactionDetails()
    }, [transactionID, account])

    return !transaction ? (
        <View style={masterStyles.emptyData}>
            <Text style={masterStyles.emptyDataText}>Loading...</Text>
        </View>
    ) : (
        <View style={masterStyles.screenContainer}>
            <View style={masterStyles.headerBar}>
                <BackButton
                    onPressAction={() => {
                        navigation.navigate('Main', { screen: 'Categories' })
                    }}
                />
                <DeleteButton
                    onPressAction={() => {
                        setDeleteTransactionModalVisible(true)
                    }}
                    disable={false}
                />
            </View>
            <View style={styles.tableContainer}>
                <View style={styles.tableRow}>
                    <Text style={styles.tableKey}>Transaction String</Text>
                    <Text style={styles.tableCell}>
                        {transaction?.TransactionString}
                    </Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableKey}>Date</Text>
                    <Text style={styles.tableCell}>{transaction?.Date}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableKey}>Amount</Text>
                    <Text style={styles.tableCell}>
                        ₹ {transaction?.Amount?.toFixed(2)}
                    </Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableKey}>D/C</Text>
                    <Text style={styles.tableCell}>
                        {transaction?.Debited ? 'Debit' : 'Credit'}
                    </Text>
                </View>
            </View>
            <View style={styles.categoryList}>
                {categories.length > 0 &&
                    categories.map((category) => (
                        <View
                            style={styles.categoryTag}
                            key={category.CategoryID}
                        >
                            <Text style={styles.categoryText}>
                                {category.Category}
                            </Text>
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => {
                                    setSelectedCategory(category)
                                    setDeleteTagModalVisible(true)
                                }}
                            >
                                <Text style={{ color: '#fff' }}>X</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
            </View>

            <View style={{ marginTop: 60, width: '90%' }}>
                <AddCategoryToTransaction
                    transactionID={transactionID}
                    account={account}
                    handleCategoryAdded={handleNewCategoryAdded}
                />
            </View>

            <Modal
                id="deleteTransactionModal"
                animationType="slide"
                visible={deleteTransactionModalVisible}
                onRequestClose={() => setDeleteTransactionModalVisible(false)}
                transparent={true}
            >
                <View style={masterStyles.modalContainer}>
                    <View style={masterStyles.modalCard}>
                        <Text style={masterStyles.modalHeader}>
                            Delete Transaction?
                        </Text>
                        <View style={masterStyles.modalFooter}>
                            <TouchableOpacity
                                style={masterStyles.modalPositiveButton}
                                onPress={() => {
                                    setDeleteTransactionModalVisible(false)
                                }}
                            >
                                <Text>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={masterStyles.modalNegativeButton}
                                onPress={async () => {
                                    handleDeleteTransaction(transactionID)
                                }}
                                disabled={false}
                            >
                                <Text>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                id="deleteTagModal"
                animationType="slide"
                visible={deleteTagModalVisible}
                onRequestClose={() => setDeleteTagModalVisible(false)}
                transparent={true}
            >
                <View style={masterStyles.modalContainer}>
                    <View style={masterStyles.modalCard}>
                        <Text style={masterStyles.modalHeader}>
                            Delete Tag for {selectedCategory?.Category}?
                        </Text>
                        <Text
                            style={{
                                marginBottom: 20,
                                alignItems: 'center',
                                textAlign: 'center',
                                fontSize: 16,
                            }}
                        >
                            This would delete the tag '{selectedCategory?.Tag}'
                            from the transaction and will not be found in that
                            category anymore.
                        </Text>
                        <View style={masterStyles.modalFooter}>
                            <TouchableOpacity
                                style={masterStyles.modalPositiveButton}
                                onPress={() => {
                                    setDeleteTagModalVisible(false)
                                }}
                            >
                                <Text>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={masterStyles.modalNegativeButton}
                                onPress={async () => {
                                    handleDeleteTag(
                                        transactionID,
                                        selectedCategory.CategoryID
                                    )
                                }}
                                disabled={false}
                            >
                                <Text>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    tableContainer: {
        margin: 10,
        width: '90%',
    },
    tableRow: {
        flexDirection: 'row',
    },
    tableCell: {
        flex: 0.72,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 5,
        fontSize: 16,
    },
    tableKey: {
        backgroundColor: '#f0f0f0',
        fontWeight: 'bold',
        fontSize: 16,
        flex: 0.28,
        padding: 5,
    },
    categoryList: {
        flexDirection: 'row',
        width: '90%',
        flexWrap: 'wrap',
        marginTop: 20,
    },
    categoryTag: {
        backgroundColor: '#00ea374f',
        borderWidth: 1,
        borderColor: '#000000ff',
        borderRadius: 20,
        padding: 6,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginRight: 8,
        marginBottom: 8,
        alignItems: 'center',
    },
    categoryText: {
        fontSize: 16,
        fontWeight: '500',
        marginRight: 5,
    },
    deleteButton: {
        backgroundColor: '#ff0000',
        borderRadius: 50,
        padding: 4,
        paddingHorizontal: 9,
        boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
    },
})

export default TransactionInfo
