import { NavigationContainer } from '@react-navigation/native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import TabNavigator from './Navigation/BottomTabNavigator'
import CategoryTransactions from './Screens/CategoryTransactions'
import { SQLiteProvider } from 'expo-sqlite'

const Stack = createNativeStackNavigator()

export default function App() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <NavigationContainer>
                <SQLiteProvider
                    databaseName="finance.db"
                    onInit={migrateDbIfNeeded}
                >
                    <Stack.Navigator
                        initialRouteName="Main"
                        screenOptions={{ headerShown: false }}
                    >
                        <Stack.Screen name="Main" component={TabNavigator} />
                        <Stack.Screen
                            name="CategoryTransactions"
                            component={CategoryTransactions}
                        />
                    </Stack.Navigator>
                </SQLiteProvider>
            </NavigationContainer>
        </GestureHandlerRootView>
    )
}

async function migrateDbIfNeeded(db) {
    const DATABASE_VERSION = 1
    const isForeignKeyEnabled = await db.execAsync(`PRAGMA foreign_keys = ON;`)
    const result = await db.getFirstAsync('PRAGMA user_version')
    const currentDbVersion = result.user_version ?? 0

    if (currentDbVersion >= DATABASE_VERSION) {
        return
    }

    if (currentDbVersion === 0) {
        await db.execAsync(`
            PRAGMA journal_mode = 'wal';

            CREATE TABLE IF NOT EXISTS accountsTable(
                Account TEXT PRIMARY KEY NOT NULL
            );

            CREATE TABLE IF NOT EXISTS transactionsTable(
                TransactionID INTEGER PRIMARY KEY AUTOINCREMENT,
                TransactionString TEXT NOT NULL,
                Date TEXT NOT NULL,
                Amount REAL NOT NULL,
                Debited INTEGER NOT NULL,
                TransactionGivenID TEXT,
                Recipient TEXT,
                RecipientBank TEXT,
                Account TEXT NOT NULL,
                FOREIGN KEY (Account) REFERENCES accountsTable (Account) ON DELETE CASCADE,
                UNIQUE (TransactionString, Account)
            );

            CREATE TABLE IF NOT EXISTS categoriesTable(
                CategoryID INTEGER PRIMARY KEY AUTOINCREMENT,
                Category TEXT NOT NULL,
                Tokens TEXT,
                Account TEXT NOT NULL,
                FOREIGN KEY (Account) REFERENCES accountsTable(Account) ON DELETE CASCADE,
                UNIQUE (Account, Category)
            );

            CREATE TABLE IF NOT EXISTS tagsTable(
                CategoryID INTEGER NOT NULL,
                TransactionID INTEGER NOT NULL,
                PRIMARY KEY (CategoryID, TransactionID),
                FOREIGN KEY (TransactionID) REFERENCES transactionsTable(TransactionID) ON DELETE CASCADE,
                FOREIGN KEY (CategoryID) REFERENCES categoriesTable(CategoryID) ON DELETE CASCADE
            );
        `)
    }

    await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`)
}
