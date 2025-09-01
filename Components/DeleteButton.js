import { TouchableOpacity, Text } from 'react-native'

const DeleteButton = ({ onPressAction, disable }) => {
    return (
        <TouchableOpacity
            onPress={onPressAction}
            style={{
                backgroundColor: '#f50000ad',
                paddingHorizontal: 8,
                paddingTop: 8,
                paddingBottom: 6,
                borderRadius: '50%',
                alignItems: 'center',
                boxShadow: '2px 4px 2px rgba(0, 0, 0, 0.34)',
            }}
            disabled={disable}
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
    )
}

export default DeleteButton
