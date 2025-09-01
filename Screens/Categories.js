import react, { useState, useEffect, use } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Modal,
    TextInput,
} from 'react-native'
import { addCategory, getAllCategories } from '../LocalDBTools/Category'
import { StyleSheet, Alert } from 'react-native'
import { parseAllTransactionsForGivenCategory } from '../LocalDBTools/storedParserTools/TagTransactions'
import accountStore from '../Store/accountStore.js'
import masterStyles from '../Styles/StylesMaster.js'
import AddButton from '../Components/AddButton.js'

const Categories = ({ navigation }) => {
    const account = accountStore((state) => state.currentAccount)
    const [categories, setCategories] = useState([])
    const [modalVisible, setModalVisible] = useState(false)
    const [newCategory, setNewCategory] = useState('')
    const [newTokens, setNewTokens] = useState('')
    const [disableCreate, setDisableCreate] = useState(false)

    const fetchCategories = async () => {
        let allCategories = await getAllCategories(account)
        allCategories = [
            ...allCategories,
            {
                CategoryID: 'Uncategorized',
                Category: 'Uncategorized',
                Tokens: '',
            },
        ]
        setCategories(allCategories)
    }

    useEffect(() => {
        if (!modalVisible) {
            fetchCategories()
        }
    }, [modalVisible, account])

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
                            {account}'s Categories
                        </Text>
                        <AddButton
                            onPressAction={() => setModalVisible(true)}
                            disable={disableCreate}
                        />
                    </View>
                    <FlatList
                        style={styles.categoryDiv}
                        data={categories}
                        keyExtractor={(item) => item.Category}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                key={item.Category}
                                style={styles.categoryCard}
                                onPress={() =>
                                    navigation.navigate(
                                        'CategoryTransactions',
                                        {
                                            CategoryID: item.CategoryID,
                                            Category: item.Category,
                                            Tokens: item.Tokens,
                                        }
                                    )
                                }
                            >
                                <Text>{item?.Category || 'Uncategorized'}</Text>
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
                                    Add New Category
                                </Text>
                                <TextInput
                                    placeholder="Category name"
                                    value={newCategory}
                                    onChangeText={setNewCategory}
                                    style={styles.modalInput}
                                />

                                <TextInput
                                    placeholder="Tokens (space separated)"
                                    value={newTokens}
                                    onChangeText={setNewTokens}
                                    style={styles.modalInput}
                                />

                                <View style={masterStyles.modalFooter}>
                                    <TouchableOpacity
                                        style={masterStyles.modalPositiveButton}
                                        onPress={async () => {
                                            setDisableCreate(true)
                                            let response = {}
                                            if (
                                                newCategory !== '' &&
                                                newTokens !== ''
                                            ) {
                                                response = await addCategory(
                                                    newCategory,
                                                    newTokens,
                                                    account
                                                )
                                                if (response.success) {
                                                    await parseAllTransactionsForGivenCategory(
                                                        response.categoryID,
                                                        account
                                                    )
                                                }
                                            } else {
                                                response = {
                                                    success: false,
                                                    message:
                                                        'Please fill in all fields',
                                                }
                                            }
                                            setModalVisible(false)
                                            Alert.alert(response.message)
                                            setDisableCreate(false)
                                            setNewCategory('')
                                            setNewTokens('')
                                        }}
                                        disabled={disableCreate}
                                    >
                                        <Text>Add</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={masterStyles.modalNegativeButton}
                                        onPress={() => {
                                            setNewCategory('')
                                            setNewTokens('')
                                            setModalVisible(false)
                                        }}
                                    >
                                        <Text>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>
            )}
        </>
    )
}

const styles = StyleSheet.create({
    categoryDiv: {
        width: '100%',
    },
    categoryCard: {
        borderWidth: 1,
        borderColor: '#000000ff',
        borderRadius: 10,
        marginHorizontal: 20,
        padding: 12,
        marginVertical: 8,
        boxShadow: '2px 4px 2px rgba(0, 0, 0, 0.34)',
    },
    modalInput: {
        borderWidth: 1,
        borderColor: '#cccccc',
        borderRadius: 10,
        padding: 10,
        width: '80%',
        marginBottom: 12,
    },
})

export default Categories
