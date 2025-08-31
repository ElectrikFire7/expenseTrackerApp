import React, { useState, useEffect } from 'react'
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Modal,
} from 'react-native'
import { getTransactionsGivenCategory } from '../LocalDBTools/Tags'
import { deleteCategory } from '../LocalDBTools/Category'

const CategoryTransactions = ({ route, navigation }) => {
    if (route?.params?.category == undefined) {
        navigation.navigate('Main', { screen: 'Categories' })
    }
    const category = route.params.category
    const tags = route.params.tagStrings.split(' ')
    const [transactions, setTransactions] = useState([])
    const [credited, setCredited] = useState(0)
    const [debited, setDebited] = useState(0)
    const [modalVisible, setModalVisible] = useState(false)
    const [disableDelete, setDisableDelete] = useState(false)

    useEffect(() => {
        const fetchTransactions = async () => {
            const allTransactions = await getTransactionsGivenCategory(category)
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
        fetchTransactions()
    }, [category])

    return (
        <View style={styles.screenContainer}>
            <View style={styles.topBar}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('Main', { screen: 'Categories' })
                    }}
                    style={{
                        backgroundColor: '#0061c9ad',
                        paddingHorizontal: 10,
                        paddingTop: 4,
                        paddingBottom: 10,
                        borderRadius: '50%',
                        alignItems: 'center',
                        marginHorizontal: 10,
                    }}
                >
                    <Text
                        style={{
                            color: '#ffffff',
                            fontWeight: 'bold',
                            fontSize: 18,
                        }}
                    >
                        ←
                    </Text>
                </TouchableOpacity>
                <Text
                    style={{ fontWeight: 'bold', fontSize: 18, paddingTop: 8 }}
                >
                    {category}
                </Text>
                <TouchableOpacity
                    onPress={() => {
                        setModalVisible(true)
                    }}
                    style={{
                        backgroundColor: '#f50000ad',
                        paddingHorizontal: 8,
                        paddingTop: 8,
                        paddingBottom: 6,
                        borderRadius: '50%',
                        alignItems: 'center',
                        marginHorizontal: 10,
                    }}
                    disabled={
                        disableDelete ||
                        category.toLowerCase() === 'uncategorized'
                    }
                >
                    <Text
                        style={{
                            color: '#ffffff',
                            fontWeight: 'bold',
                            fontSize: 18,
                        }}
                    >
                        🗑️
                    </Text>
                </TouchableOpacity>
            </View>
            {category.toLowerCase() !== 'uncategorized' && (
                <View style={styles.tagsBar}>
                    {tags.map((tag, index) => (
                        <Text style={styles.tags} key={index}>
                            {tag}
                        </Text>
                    ))}
                </View>
            )}
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
                keyExtractor={(item) => item.TransactionString}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.transactionCard}>
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
                <View style={styles.modalContainer}>
                    <View style={styles.modalCard}>
                        <Text style={styles.modalHeader}>
                            Delete {category}?
                        </Text>
                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={{
                                    width: '50%',
                                    backgroundColor: '#0061c9ad',
                                    padding: 10,
                                    borderRadius: 10,
                                    alignItems: 'center',
                                    marginHorizontal: 5,
                                }}
                                onPress={() => {
                                    setModalVisible(false)
                                }}
                            >
                                <Text>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    width: '50%',
                                    backgroundColor: '#c90000ad',
                                    padding: 10,
                                    borderRadius: 10,
                                    alignItems: 'center',
                                    marginHorizontal: 5,
                                }}
                                onPress={async () => {
                                    setDisableDelete(true)
                                    await deleteCategory(category)
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
    screenContainer: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 60,
        width: '100%',
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 10,
        marginBottom: 10,
    },
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
    modalContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    modalCard: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 20,
        width: '80%',
        elevation: 5,
        alignItems: 'center',
        flexDirection: 'column',
    },
    modalHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    modalFooter: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '80%',
    },
})

export default CategoryTransactions
