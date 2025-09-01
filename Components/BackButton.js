import { TouchableOpacity, Text } from 'react-native'

const BackButton = ({ onPressAction }) => {
    return (
        <TouchableOpacity
            onPress={onPressAction}
            style={{
                backgroundColor: '#0061c9ad',
                paddingHorizontal: 10,
                paddingTop: 4,
                paddingBottom: 10,
                borderRadius: '50%',
                alignItems: 'center',
                boxShadow: '2px 4px 2px rgba(0, 0, 0, 0.34)',
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
    )
}

export default BackButton
