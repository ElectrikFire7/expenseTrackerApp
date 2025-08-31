import { View, Text, Button } from 'react-native'
import { setUpDB, getDBInfo, dropTable } from '../LocalDBTools/SetUpDB'
import { StyleSheet } from 'react-native'
import { parseForAllCategoriesAllTransactions } from '../LocalDBTools/storedParserTools/TagTransactions'

const TempHome = () => {
    const setUpDatabase = async () => {
        try {
            const result = await setUpDB()
            console.log('Database setup result:', result)
        } catch (error) {
            console.error('Error setting up database:', error)
        }
    }

    const getDatabaseInfo = async () => {
        try {
            const info = await getDBInfo()
            console.log('Database info:', info)
        } catch (error) {
            console.error('Error getting database info:', error)
        }
    }

    return (
        <View style={styles.container}>
            <Text>Temporary Home Screen</Text>
            <Button title="Set Up Database" onPress={setUpDatabase} />
            <Button title="Get Database Info" onPress={getDatabaseInfo} />
            <Button title="Drop Table to clear" onPress={dropTable} />
            <Button
                title="Parse for Categories"
                onPress={() => parseForAllCategoriesAllTransactions()}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        margin: 10,
    },
})

export default TempHome
