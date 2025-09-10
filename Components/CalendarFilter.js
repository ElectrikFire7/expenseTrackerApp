import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'
import { useState, useEffect } from 'react'

const CalendarFilter = ({ onApply }) => {
    const [filterType, setFilterType] = useState('All')
    const filterTypeList = [
        { label: 'All', value: 'All' },
        { label: 'Year', value: 'Year' },
        { label: 'Month', value: 'Month' },
    ]
    const [openFilterType, setOpeFilterType] = useState(false)

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

    const [month, setMonth] = useState(
        (new Date().getMonth() + 1).toString().padStart(2, '0')
    )

    const monthList = [
        { label: 'Jan', value: '01' },
        { label: 'Feb', value: '02' },
        { label: 'Mar', value: '03' },
        { label: 'Apr', value: '04' },
        { label: 'May', value: '05' },
        { label: 'Jun', value: '06' },
        { label: 'Jul', value: '07' },
        { label: 'Aug', value: '08' },
        { label: 'Sep', value: '09' },
        { label: 'Oct', value: '10' },
        { label: 'Nov', value: '11' },
        { label: 'Dec', value: '12' },
    ]
    const [openMonth, setOpenMonth] = useState(false)

    return (
        <View style={styles.filterBar}>
            <View style={styles.filter}>
                <DropDownPicker
                    open={openFilterType}
                    value={filterType}
                    items={filterTypeList}
                    setOpen={setOpeFilterType}
                    setValue={setFilterType}
                    placeholder="Select Filter Type"
                />
            </View>
            {filterType === 'Year' || filterType === 'Month' ? (
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
            ) : (
                <View style={styles.filter} />
            )}
            {filterType === 'Month' ? (
                <View style={styles.filter}>
                    <DropDownPicker
                        open={openMonth}
                        value={month}
                        items={monthList}
                        setOpen={setOpenMonth}
                        setValue={setMonth}
                        placeholder="Select Month"
                    />
                </View>
            ) : (
                <View style={styles.filter} />
            )}
            <View style={styles.filter}>
                <TouchableOpacity
                    style={styles.applyButton}
                    onPress={() => onApply(filterType, year, month)}
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
        width: '25%',
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

export default CalendarFilter
