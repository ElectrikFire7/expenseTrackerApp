import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import TempHome from '../Screens/TempHome'
import Categories from '../Screens/Categories'
import Accounts from '../Screens/Accounts'
import AddTransaction from '../Screens/AddTransaction'
import Charts from '../Screens/Charts'
import UserIcon from '../assets/user.svg'
import DatabaseIcon from '../assets/database.svg'
import BookIcon from '../assets/book.svg'
import PieChart from '../assets/pie-chart.svg'

const Tab = createBottomTabNavigator()

export default function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ color, size }) => {
                    if (route.name === 'Accounts') {
                        return (
                            <UserIcon width={size} height={size} fill={color} />
                        )
                    } else if (route.name === 'Categories') {
                        return (
                            <DatabaseIcon
                                width={size}
                                height={size}
                                fill={color}
                            />
                        )
                    } else if (route.name === 'Add Transaction') {
                        return (
                            <BookIcon width={size} height={size} fill={color} />
                        )
                    } else if (route.name === 'Charts') {
                        return (
                            <PieChart width={size} height={size} fill={color} />
                        )
                    }
                },
            })}
        >
            <Tab.Screen name="Accounts" component={Accounts} />
            <Tab.Screen name="Categories" component={Categories} />
            <Tab.Screen name="Admin" component={TempHome} />
            <Tab.Screen name="Add Transaction" component={AddTransaction} />
            <Tab.Screen name="Charts" component={Charts} />
        </Tab.Navigator>
    )
}
