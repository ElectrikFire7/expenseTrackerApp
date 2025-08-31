import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import TempHome from '../Screens/TempHome'
import Categories from '../Screens/Categories'
import Users from '../Screens/Users'
import AddTransaction from '../Screens/AddTransaction'

const Tab = createBottomTabNavigator()

export default function TabNavigator() {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen name="Users" component={Users} />
            <Tab.Screen name="Categories" component={Categories} />
            <Tab.Screen name="Home" component={TempHome} />
            <Tab.Screen name="Add Transaction" component={AddTransaction} />
        </Tab.Navigator>
    )
}
