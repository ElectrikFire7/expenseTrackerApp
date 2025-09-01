import { TouchableOpacity, Text } from 'react-native'
import { StyleSheet } from 'react-native'

const AddButton = ({ onPressAction, disable }) => {
    return (
        <TouchableOpacity
            style={styles.addUserButton}
            onPress={onPressAction}
            disabled={disable}
        >
            <Text style={styles.addUserButtonText}>+</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    addUserButton: {
        backgroundColor: '#0061c9ad',
        paddingHorizontal: 12,
        paddingTop: 0,
        paddingBottom: 3,
        borderRadius: '50%',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '2px 4px 2px rgba(0, 0, 0, 0.34)',
    },
    addUserButtonText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 24,
    },
})

export default AddButton
