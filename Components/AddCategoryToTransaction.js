import { Button, StyleSheet, View } from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'
import React, { useEffect, useState } from 'react'
import { addTag } from '../LocalDBTools/Tags'
import { getAllCategories } from '../LocalDBTools/Category'
import { useSQLiteContext } from 'expo-sqlite'

const AddCategoryToTransaction = ({
    transactionID,
    account,
    handleCategoryAdded,
}) => {
    const [openDropdown, setOpenDropdown] = useState(false)
    const [category, setCategory] = useState(null)
    const [items, setItems] = useState([])
    const db = useSQLiteContext()

    const fetchCategories = async () => {
        const categories = await getAllCategories(db, account)
        const formattedCategories = categories.map((cat) => ({
            label: cat.Category,
            value: cat.CategoryID,
        }))
        setItems(formattedCategories)
    }

    useEffect(() => {
        fetchCategories()
    }, [])

    return (
        <View style={styles.container}>
            <DropDownPicker
                open={openDropdown}
                value={category}
                items={items}
                setOpen={setOpenDropdown}
                setValue={setCategory}
                setItems={setItems}
                placeholder="Select a Category"
                listMode="SCROLLVIEW"
                maxHeight={120}
            />

            <View style={styles.buttonContainer}>
                <Button
                    title="Add Category"
                    onPress={async () => {
                        if (category && transactionID) {
                            const result = await addTag(
                                db,
                                category,
                                transactionID
                            )
                            alert(result.message)
                            setCategory(null)
                            setOpenDropdown(false)
                            handleCategoryAdded()
                        }
                    }}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
    },
    buttonContainer: {
        marginTop: 10,
        width: '50%',
    },
})

export default AddCategoryToTransaction
