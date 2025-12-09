import {
    StyleSheet,
    Text,
    View
} from 'react-native';

// NOTE: Card has been replaced with a View styled as a card (styles.cardBase)
export const MarketGraph = ({ data }) => {
  // In a real app, you'd use a charting library here.
  const latestValue = data[data.length - 1].value;
  const change = data[data.length - 1].value - data[0].value;
  const changePercent = ((change / data[0].value) * 100).toFixed(2);
  const isPositive = change >= 0;

  return (
    <View style={[styles.cardBase, styles.graphCard]}>
      <View style={styles.graphHeader}>
        <Text style={styles.graphTitle}>📈 Daily Market Valuation</Text>
        <Text style={isPositive ? styles.positiveChange : styles.negativeChange}>
          {isPositive ? '▲' : '▼'} {changePercent}%
        </Text>
      </View>
      <Text style={styles.currentValue}>K{latestValue.toLocaleString()}</Text>
      <View style={styles.graphPlaceholder}>
        {/* Actual LineChart component would go here */}
        <Text style={{ textAlign: 'center', color: '#888' }}>
          [Real-Time Line Graph Placeholder]
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Base Card Styling (Replaces React Native Paper Card)
  cardBase: {
    marginHorizontal: 15,
    padding: 15,
    borderRadius: 12,
    backgroundColor: '#fff',
    // iOS Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Android Shadow/Elevation
    elevation: 4,
  },

  // Market Graph Styling
  graphCard: {
    // Already defined in cardBase, no extra styles needed here unless specific
  },
  graphHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  graphTitle: {
    fontSize: 16,
    color: '#555',
    fontWeight: '600',
  },
  positiveChange: {
    color: '#4CAF50',
    fontWeight: 'bold',
    fontSize: 16,
  },
  negativeChange: {
    color: '#F44336',
    fontWeight: 'bold',
    fontSize: 16,
  },
  currentValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#08a108ff',
    marginVertical: 5,
  },
  graphPlaceholder: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4ff',
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 5,
  },
});
