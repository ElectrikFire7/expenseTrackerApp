import { View, Dimensions } from 'react-native'
import { BarChart } from 'react-native-gifted-charts'

const screenWidth = Dimensions.get('window').width

const CDCharts = ({ creditedData, debitedData }) => {
    const labels = [
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
    ]

    const barData = []
    labels.forEach((label, i) => {
        barData.push({
            value: creditedData[i] || 0,
            frontColor: '#4cd137',
            label: '',
            spacing: 1,
        })
        barData.push({
            value: debitedData[i] || 0,
            frontColor: '#ff6b6b',
            label: label,
        })
    })

    return (
        <View style={{ padding: 16 }}>
            {creditedData.length && debitedData.length ? (
                <BarChart
                    data={barData}
                    barWidth={10}
                    spacing={20}
                    yAxisThickness={0}
                    xAxisThickness={0}
                    showStackLabels={false}
                    isAnimated
                    width={screenWidth * 0.9}
                    formatYLabel={(value) => {
                        const num = Number(value)
                        if (num >= 100000)
                            return (num / 100000).toFixed(1) + 'L'
                        if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
                        return num.toString()
                    }}
                    roundedTop
                    yAxisLabelWidth={50}
                />
            ) : null}
        </View>
    )
}

export default CDCharts
