import { StyleSheet } from 'react-native'

const backgroundColor = '#ffffff'

const masterStyles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 60,
        width: '100%',
        backgroundColor: backgroundColor,
    },
    headerBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
        marginBottom: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
    },

    //modal
    modalContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    modalCard: {
        backgroundColor: backgroundColor,
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
    modalPositiveButton: {
        width: '50%',
        backgroundColor: '#0061c9ad',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    modalNegativeButton: {
        width: '50%',
        backgroundColor: '#c90000ad',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    emptyData: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    emptyDataText: {
        fontSize: 18,
        color: '#888888',
    },
})

export default masterStyles
