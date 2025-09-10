import React, { useState, useEffect } from 'react'
import { View, Text, Dimensions } from 'react-native'
import masterStyles from '../Styles/StylesMaster'
import accountStore from '../Store/accountStore.js'
import {
    fetchAllTransactionsFullYearData,
    fetchCategoryTransactionsFullYearData,
    fetchUncategorizedTransactionsFullYearData,
} from '../LocalDBTools/ChartTools/chartData.js'
import ChartFilter from '../Components/ChartFilter.js'
import { BarChart } from 'react-native-chart-kit'
import CDCharts from '../Components/CDChart.js'

const screenWidth = Dimensions.get('window').width

const Charts = () => {
    const account = accountStore((state) => state.currentAccount)
    const [creditedData, setCreditedData] = useState([])
    const [debitedData, setDebitedData] = useState([])

    const handleApplyFilter = async (db, categoryID, year) => {
        let data = []
        if (categoryID == null) {
            data = await fetchAllTransactionsFullYearData(
                db,
                account,
                year.toString()
            )
        } else if (categoryID == 'Uncategorized') {
            data = await fetchUncategorizedTransactionsFullYearData(
                db,
                account,
                year.toString()
            )
        } else {
            data = await fetchCategoryTransactionsFullYearData(
                db,
                account,
                year.toString(),
                categoryID
            )
        }
        const credited = data.map((item) => item.TotalIncome)
        const debited = data.map((item) => item.TotalExpense)
        setCreditedData(credited)
        setDebitedData(debited)
    }

    return (
        <>
            {account == null ? (
                <View style={masterStyles.emptyData}>
                    <Text style={masterStyles.emptyDataText}>
                        Select an account to use this page
                    </Text>
                </View>
            ) : (
                <View style={masterStyles.screenContainer}>
                    <View style={masterStyles.headerBar}>
                        <Text style={masterStyles.header}>
                            {account}'s Charts
                        </Text>
                    </View>
                    <View style={{ width: '90%' }}>
                        <ChartFilter onApply={handleApplyFilter} />
                    </View>
                    {/* <BarChart
                        data={{
                            labels: [
                                'Jan',
                                'Feb',
                                'Mar',
                                'Apr',
                                'May',
                                'Jun',
                                'Jul',
                                'Aug',
                                'Sep',
                                'Oct',
                                'Nov',
                                'Dec',
                            ],
                            datasets: [
                                {
                                    data: creditedData,
                                },
                                {
                                    data: debitedData,
                                },
                            ],
                            legend: ['Expenses', 'Income'],
                        }}
                        width={screenWidth * 0.9}
                        height={220}
                        withInnerLines={false}
                        yAxisLabel="₹"
                        chartConfig={{
                            backgroundGradientFrom: '#fff',
                            backgroundGradientTo: '#fff',
                            decimalPlaces: 2,
                            color: (opacity = 0) =>
                                `rgba(255, 0, 0, ${opacity})`,
                            labelColor: (opacity = 1) =>
                                `rgba(255, 0, 0, ${opacity})`,
                            barPercentage: 0.5,
                        }}
                        verticalLabelRotation={0}
                        showValuesOnTopOfBars={true}
                    /> */}

                    <CDCharts
                        creditedData={creditedData}
                        debitedData={debitedData}
                    />
                </View>
            )}
        </>
    )
}

export default Charts
