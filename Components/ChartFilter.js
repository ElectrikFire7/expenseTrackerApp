import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'
import { useState, useEffect } from 'react'
import { useSQLiteContext } from 'expo-sqlite'
import accountStore from '../Store/accountStore.js'
import { getAllCategories } from '../LocalDBTools/Category.js'

const ChartFilter = ({ onApply }) => {
    const account = accountStore((state) => state.currentAccount)
    const [year, setYear] = useState(new Date().getFullYear())
    const yearList = [
        {
            label: (new Date().getFullYear() - 4).toString(),
            value: new Date().getFullYear() - 4,
        },
        {
            label: (new Date().getFullYear() - 3).toString(),
            value: new Date().getFullYear() - 3,
        },
        {
            label: (new Date().getFullYear() - 2).toString(),
            value: new Date().getFullYear() - 2,
        },
        {
            label: (new Date().getFullYear() - 1).toString(),
            value: new Date().getFullYear() - 1,
        },
        {
            label: new Date().getFullYear().toString(),
            value: new Date().getFullYear(),
        },
    ]
    const [openYear, setOpenYear] = useState(false)

    const [openDropdown, setOpenDropdown] = useState(false)
    const [category, setCategory] = useState(null)
    const [items, setItems] = useState([])
    const db = useSQLiteContext()

    const fetchCategories = async () => {
        const categories = await getAllCategories(db, account)
        let formattedCategories = categories.map((cat) => ({
            label: cat.Category,
            value: cat.CategoryID,
        }))
        formattedCategories = [
            { label: 'All', value: null },
            ...formattedCategories,
            { label: 'Uncategorized', value: 'Uncategorized' },
        ]
        setItems(formattedCategories)
    }

    useEffect(() => {
        fetchCategories()
        onApply(db, category, year)
    }, [])

    return (
        <View style={styles.filterBar}>
            <View style={styles.filter}>
                <DropDownPicker
                    open={openDropdown}
                    value={category}
                    items={items}
                    setOpen={setOpenDropdown}
                    setValue={setCategory}
                    placeholder="Select Category"
                />
            </View>
            <View style={styles.filter}>
                <DropDownPicker
                    open={openYear}
                    value={year}
                    items={yearList}
                    setOpen={setOpenYear}
                    setValue={setYear}
                    placeholder="Select Year"
                />
            </View>

            <View style={styles.filter}>
                <TouchableOpacity
                    style={styles.applyButton}
                    onPress={() => onApply(db, category, year)}
                >
                    <Text style={styles.applyText}>Apply</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    filterBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginVertical: 8,
    },
    filter: {
        width: '30%',
        marginRight: 5,
    },
    applyContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '25%',
    },
    applyButton: {
        borderWidth: 1,
        borderRadius: 20,
        padding: 8,
        backgroundColor: '#0061c9ad',
    },
    applyText: {
        color: '#ffffff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
})

export default ChartFilter
