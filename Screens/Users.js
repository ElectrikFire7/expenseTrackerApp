import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    TextInput,
    Alert,
} from 'react-native'
import { addUser, getAllUsers, deleteUser } from '../LocalDBTools/User'
import { useState, useEffect } from 'react'
import userStore from '../Store/userStore'

const Users = () => {
    const [currentUser, setCurrentUser] = useState(null)
    const [users, setUsers] = useState([])
    const [newUser, setNewUser] = useState('')
    const [disableCreate, setDisableCreate] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)

    const handleGetAllUsers = async () => {
        const usersList = await getAllUsers()
        setUsers(usersList)
        if (currentUser == null) {
            setCurrentUser(usersList[0])
            userStore.getState().setCurrentUser(usersList[0])
        }
    }

    useEffect(() => {
        if (!disableCreate) {
            handleGetAllUsers()
        }
    }, [disableCreate])
    return (
        <View style={styles.screenContainer}>
            <View style={styles.infoBarContainer}>
                <Text>Manage Users</Text>
                <TouchableOpacity
                    style={styles.addUserButton}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={styles.addUserButtonText}>+</Text>
                </TouchableOpacity>
            </View>
            <View>
                {users.map((user) => (
                    <Text key={user.username}>{user.username}</Text>
                ))}
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false)
                }}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalCard}>
                        <Text style={styles.modalHeader}>Add New User</Text>
                        <TextInput
                            placeholder="Enter New Username"
                            value={newUser}
                            onChangeText={setNewUser}
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
                                    if (newUser != '') {
                                        response = await addUser(newUser)
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
                                    setNewUser('')
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
                                    setNewUser('')
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
    infoBarContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
        marginBottom: 20,
    },
    addUserButton: {
        backgroundColor: '#0061c9ad',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: '50%',
    },
    addUserButtonText: {
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

export default Users
