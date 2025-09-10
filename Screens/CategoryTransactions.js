import React, { useState, useEffect } from 'react'
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Modal,
} from 'react-native'
import { useSQLiteContext } from 'expo-sqlite'
import {
    getTransactionsGivenCategory,
    getTransactionsGivenCategoryFiltered,
} from '../LocalDBTools/Tags'
import { deleteCategory } from '../LocalDBTools/Category'
import accountStore from '../Store/accountStore.js'
import masterStyles from '../Styles/StylesMaster.js'
import DeleteButton from '../Components/DeleteButton.js'
import BackButton from '../Components/BackButton.js'
import CalendarFilter from '../Components/CalendarFilter.js'

const CategoryTransactions = ({ route, navigation }) => {
    if (route?.params?.CategoryID == undefined) {
        navigation.navigate('Main', { screen: 'Categories' })
    }
    const db = useSQLiteContext()
    const category = route.params.Category
    const tokens = route.params.Tokens.split(' ')
    const categoryID = route.params.CategoryID
    const account = accountStore.getState().currentAccount
    const [transactions, setTransactions] = useState([])
    const [credited, setCredited] = useState(0)
    const [debited, setDebited] = useState(0)
    const [modalVisible, setModalVisible] = useState(false)
    const [disableDelete, setDisableDelete] = useState(false)

    const fetchTransactions = async () => {
        const allTransactions = await getTransactionsGivenCategory(
            db,
            categoryID,
            account
        )
        setTransactions(allTransactions)
        const dc = allTransactions.reduce(
            (acc, tx) => {
                tx?.Debited == 1
                    ? (acc.debited += tx?.Amount)
                    : (acc.credited += tx?.Amount)
                return acc
            },
            { credited: 0, debited: 0 }
        )
        setCredited(dc.credited.toFixed(2))
        setDebited(dc.debited.toFixed(2))
    }

    const handleApplyFilter = async (filterType, year, month) => {
        let filteredTransactions = []
        let filter = ''
        if (filterType === 'All') {
            fetchTransactions()
            return
        }
        if (filterType === 'Year') {
            filter = year.toString()
            filteredTransactions = await getTransactionsGivenCategoryFiltered(
                db,
                categoryID,
                account,
                filter
            )
            console.log('Filtering by year: ', filter)
        }
        if (filterType === 'Month') {
            filter = year.toString() + '-' + month
            filteredTransactions = await getTransactionsGivenCategoryFiltered(
                db,
                categoryID,
                account,
                filter
            )
        }
        setTransactions(filteredTransactions)
        const dc = filteredTransactions.reduce(
            (acc, tx) => {
                tx?.Debited == 1
                    ? (acc.debited += tx?.Amount)
                    : (acc.credited += tx?.Amount)
                return acc
            },
            { credited: 0, debited: 0 }
        )
        setCredited(dc.credited.toFixed(2))
        setDebited(dc.debited.toFixed(2))
    }

    useEffect(() => {
        fetchTransactions()
    }, [category])

    return (
        <View style={masterStyles.screenContainer}>
            <View style={masterStyles.headerBar}>
                <BackButton
                    onPressAction={() => {
                        navigation.navigate('Main', { screen: 'Categories' })
                    }}
                />
                <Text style={masterStyles.header}>{category}</Text>
                <DeleteButton
                    onPressAction={() => {
                        setModalVisible(true)
                    }}
                    disable={
                        disableDelete ||
                        category.toLowerCase() === 'uncategorized'
                    }
                />
            </View>
            {category.toLowerCase() !== 'uncategorized' && (
                <View style={styles.tagsBar}>
                    {tokens.map((token, index) => (
                        <Text style={styles.tags} key={index}>
                            {token}
                        </Text>
                    ))}
                </View>
            )}
            <View style={{ width: '90%' }}>
                <CalendarFilter onApply={handleApplyFilter} />
            </View>
            <View style={styles.amountBar}>
                <View style={styles.amountBarRow}>
                    <Text style={{ fontWeight: 'bold' }}>CREDITED:</Text>
                    <Text style={{ color: '#33a619ff' }}>{credited}</Text>
                </View>
                <View style={styles.amountBarRow}>
                    <Text style={{ fontWeight: 'bold' }}>DEBITED:</Text>
                    <Text style={{ color: '#eb0c0cff' }}>{debited}</Text>
                </View>
            </View>
            <FlatList
                style={styles.transactionList}
                data={transactions}
                keyExtractor={(item) => item.TransactionID.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.transactionCard}
                        onPress={() =>
                            navigation.navigate('Transaction Info', {
                                TransactionID: item.TransactionID,
                            })
                        }
                    >
                        <View style={styles.transactionHeader}>
                            <Text>{item.Date}</Text>
                            <Text>{item.Amount.toFixed(2)}</Text>
                        </View>
                        <Text>{item.TransactionString}</Text>
                    </TouchableOpacity>
                )}
            />

            <Modal
                animationType="slide"
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
                transparent={true}
            >
                <View style={masterStyles.modalContainer}>
                    <View style={masterStyles.modalCard}>
                        <Text style={masterStyles.modalHeader}>
                            Delete {category}?
                        </Text>
                        <View style={masterStyles.modalFooter}>
                            <TouchableOpacity
                                style={masterStyles.modalPositiveButton}
                                onPress={() => {
                                    setModalVisible(false)
                                }}
                            >
                                <Text>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={masterStyles.modalNegativeButton}
                                onPress={async () => {
                                    setDisableDelete(true)
                                    await deleteCategory(db, categoryID)
                                    setModalVisible(false)
                                    navigation.navigate('Main', {
                                        screen: 'Categories',
                                    })
                                }}
                                disabled={disableDelete}
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
    tagsBar: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        width: '90%',
        marginBottom: 8,
    },
    tags: {
        backgroundColor: '#00ea374f',
        borderWidth: 1,
        borderRadius: 50,
        paddingHorizontal: 8,
        paddingVertical: 1,
        marginRight: 5,
    },
    amountBar: {
        flexDirection: 'column',
        width: '90%',
        marginBottom: 8,
    },
    amountBarRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    transactionList: {
        width: '100%',
        flex: 0.1,
    },
    transactionCard: {
        marginHorizontal: 10,
        marginVertical: 8,
        borderColor: '#000000ff',
        borderRadius: 10,
        borderWidth: 1,
        padding: 10,
        boxShadow: '2px 4px 2px rgba(0, 0, 0, 0.34)',
    },
    transactionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
})

export default CategoryTransactions
