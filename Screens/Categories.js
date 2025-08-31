import react, { useState, useEffect } from 'react'
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
import userStore from '../Store/userStore'

const Categories = ({ navigation }) => {
    if (!userStore.getState().currentUser) {
        return <Text>No user selected/created</Text>
    }
    const user = userStore.getState().currentUser
    const [categories, setCategories] = useState([])
    const [modalVisible, setModalVisible] = useState(false)
    const [newCategory, setNewCategory] = useState('')
    const [newTags, setNewTags] = useState('')
    const [disableCreate, setDisableCreate] = useState(false)

    const fetchCategories = async () => {
        let allCategories = await getAllCategories()
        allCategories = [
            ...allCategories,
            { category: 'Uncategorized', tagStrings: '' },
        ]
        setCategories(allCategories)
    }

    useEffect(() => {
        if (!modalVisible) {
            fetchCategories()
        }
    }, [modalVisible])

    return (
        <View style={styles.screenContainer}>
            <View style={styles.infoBarContainer}>
                <Text>{user.username}'s Categories</Text>
                <TouchableOpacity
                    style={styles.addCategoryButton}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={styles.addCategoryButtonText}>+</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                style={styles.categoryDiv}
                data={categories}
                keyExtractor={(item) => item.category}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        key={item}
                        style={styles.categoryCard}
                        onPress={() =>
                            navigation.navigate('CategoryTransactions', {
                                category: item.category,
                                tagStrings: item.tagStrings,
                            })
                        }
                    >
                        <Text>{item.category}</Text>
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
                        <Text style={styles.modalHeader}>Add New Category</Text>
                        <TextInput
                            placeholder="Category name"
                            value={newCategory}
                            onChangeText={setNewCategory}
                            style={styles.modalInput}
                        />

                        <TextInput
                            placeholder="Tags (space separated separated)"
                            value={newTags}
                            onChangeText={setNewTags}
                            style={styles.modalInput}
                        />

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
                                onPress={async () => {
                                    setDisableCreate(true)
                                    let response = {}
                                    if (newCategory !== '' && newTags !== '') {
                                        response = await addCategory(
                                            newCategory,
                                            newTags
                                        )
                                        if (response.success) {
                                            parseAllTransactionsForGivenCategory(
                                                {
                                                    category: newCategory,
                                                    tagStrings: newTags,
                                                }
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
                                    setNewTags('')
                                }}
                                disabled={disableCreate}
                            >
                                <Text>Add</Text>
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
                                onPress={() => {
                                    setNewCategory('')
                                    setNewTags('')
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
    )
}

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 60,
        width: '100%',
    },
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
    infoBarContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
        marginBottom: 20,
    },
    addCategoryButton: {
        backgroundColor: '#0061c9ad',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: '50%',
    },
    addCategoryButtonText: {
        color: '#ffffff',
        fontWeight: 'bold',
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
    modalInput: {
        borderWidth: 1,
        borderColor: '#cccccc',
        borderRadius: 10,
        padding: 10,
        width: '80%',
        marginBottom: 12,
    },
    modalFooter: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '80%',
    },
})

export default Categories
