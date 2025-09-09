import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    TextInput,
    Alert,
} from 'react-native'
import {
    addAccount,
    getAllAccounts,
    deleteAccount,
} from '../LocalDBTools/Account'
import { useState, useEffect } from 'react'
import accountStore from '../Store/accountStore.js'
import masterStyles from '../Styles/StylesMaster.js'
import AddButton from '../Components/AddButton.js'
import DeleteButton from '../Components/DeleteButton.js'
import { useSQLiteContext } from 'expo-sqlite'

const Accounts = () => {
    const db = useSQLiteContext()
    const [currentAccount, setCurrentAccount] = useState(null)
    const [accounts, setAccounts] = useState([])
    const [newAccount, setNewAccount] = useState('')
    const [disableCreate, setDisableCreate] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [deleteAccount, setDeleteAccount] = useState(null)
    const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false)

    const handleGetAllAccounts = async () => {
        const accountsList = await getAllAccounts(db)
        setAccounts(accountsList)
        if (currentAccount == null) {
            setCurrentAccount(accountsList[0].Account)
            accountStore.getState().setCurrentAccount(accountsList[0].Account)
        }
    }

    const handleCreateAccount = async () => {
        setDisableCreate(true)
        let response = {}
        if (newAccount != '') {
            response = await addAccount(db, newAccount)
        } else {
            response = {
                success: false,
                message: 'Please fill in all fields',
            }
        }
        setModalVisible(false)
        Alert.alert(response.message)
        setDisableCreate(false)
        setNewAccount('')
    }

    const handleSetCurrentAccount = (account) => {
        setCurrentAccount(account)
        accountStore.getState().setCurrentAccount(account)
    }

    const handleDeleteAccount = async (account) => {
        if (account === currentAccount) {
            setCurrentAccount(null)
            accountStore.getState().setCurrentAccount(null)
        }
        let response = await deleteAccount(db, account)
        handleGetAllAccounts()
        Alert.alert(response.message)
    }

    useEffect(() => {
        if (!disableCreate) {
            handleGetAllAccounts()
        }
    }, [disableCreate])

    return (
        <View style={masterStyles.screenContainer}>
            <View style={masterStyles.headerBar}>
                <Text style={masterStyles.header}>Manage Accounts</Text>
                <AddButton
                    onPressAction={() => setModalVisible(true)}
                    disable={accounts.length >= 8}
                />
            </View>

            {accounts.length > 0 ? (
                <View style={styles.accountListContainer}>
                    {accounts.map((account) => (
                        <View
                            key={account.Account}
                            style={styles.accountItemContainer}
                        >
                            <TouchableOpacity
                                style={
                                    currentAccount === account.Account
                                        ? styles.accountDetailsSelected
                                        : styles.accountDetails
                                }
                                disabled={account.Account === currentAccount}
                                onPress={() =>
                                    handleSetCurrentAccount(account.Account)
                                }
                            >
                                <Text>{account.Account}</Text>
                            </TouchableOpacity>
                            <View>
                                <DeleteButton
                                    onPressAction={() => (
                                        setDeleteAccount(account.Account),
                                        setConfirmDeleteVisible(true)
                                    )}
                                />
                            </View>
                        </View>
                    ))}
                </View>
            ) : (
                <View style={masterStyles.emptyData}>
                    <Text style={masterStyles.emptyDataText}>
                        To create account press + icon
                    </Text>
                </View>
            )}

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false)
                }}
            >
                <View style={masterStyles.modalContainer}>
                    <View style={masterStyles.modalCard}>
                        <Text style={masterStyles.modalHeader}>
                            Add New Account
                        </Text>
                        <TextInput
                            placeholder="Enter New Account Name"
                            placeholderTextColor="#858585ff"
                            value={newAccount}
                            onChangeText={setNewAccount}
                            style={styles.modalInput}
                        />

                        <View style={masterStyles.modalFooter}>
                            <TouchableOpacity
                                style={masterStyles.modalPositiveButton}
                                onPress={() => handleCreateAccount()}
                                disabled={disableCreate}
                            >
                                <Text>Add</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={masterStyles.modalNegativeButton}
                                onPress={() => {
                                    setNewAccount('')
                                    setModalVisible(false)
                                }}
                            >
                                <Text>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={confirmDeleteVisible}
                onRequestClose={() => {
                    setConfirmDeleteVisible(false)
                }}
            >
                <View style={masterStyles.modalContainer}>
                    <View style={masterStyles.modalCard}>
                        <Text style={masterStyles.modalHeader}>
                            Delete {deleteAccount} Account?
                        </Text>

                        <View style={masterStyles.modalFooter}>
                            <TouchableOpacity
                                style={masterStyles.modalPositiveButton}
                                onPress={() => setConfirmDeleteVisible(false)}
                                disabled={disableCreate}
                            >
                                <Text>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={masterStyles.modalNegativeButton}
                                onPress={() => {
                                    handleDeleteAccount(deleteAccount)
                                    setConfirmDeleteVisible(false)
                                }}
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
    modalInput: {
        borderWidth: 1,
        borderColor: '#cccccc',
        borderRadius: 10,
        padding: 10,
        width: '80%',
        marginBottom: 12,
    },
    accountListContainer: {
        marginTop: 16,
        width: '100%',
        alignItems: 'center',
    },
    accountItemContainer: {
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    accountDetails: {
        flex: 1,
        padding: 12,
        marginRight: 8,
        backgroundColor: '#d1d1d1ff',
    },
    accountDetailsSelected: {
        backgroundColor: '#f5f4f4ff',
        flex: 1,
        padding: 12,
        marginRight: 8,
    },
})

export default Accounts
