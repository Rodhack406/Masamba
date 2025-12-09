import {
    Dimensions,
    StyleSheet,
    Text,
    View
} from 'react-native';
// Ensure you have react-native-vector-icons installed:
// npx expo install react-native-vector-icons
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const screenWidth = Dimensions.get('window').width;

/**
 * Market Advice Item Component: Displays a single piece of market advice.
 */
const MarketAdviceItem = ({ advice }) => {
    // Determine icon based on insight content
    const getIconName = (insight) => {
        if (insight.toLowerCase().includes('arrived')) return 'truck-fast-outline';
        if (insight.toLowerCase().includes('out of stock') || insight.toLowerCase().includes('no stock')) return 'alert-octagon-outline';
        return 'lightbulb-on-outline';
    };

    return (
        <View style={styles.adviceItem}>
            <Icon name={getIconName(advice.insight)} size={20} color="#FF9800" style={styles.adviceIcon} />
            <View style={styles.adviceContent}>
                <Text style={styles.adviceTime}>{advice.time}</Text>
                <Text style={styles.adviceText}>{advice.insight}</Text>
            </View>
        </View>
    );
};

/**
 * MarketAdviceInsight Component: Displays the list of market advice.
 */
export const MarketAdviceInsight = ({ marketAdvice }) => (
    <>
        <Text style={styles.sectionTitle}>Market Advice</Text>
        <View style={[styles.cardBase, styles.adviceCard]}>
            {marketAdvice.map((item, index) => (
                // Uses the placeholder/imported MarketAdviceItem
                <MarketAdviceItem key={index} advice={item} />
            ))}
            <Text style={styles.adviceFooter}>
                Data refreshed at {new Date().toLocaleTimeString()}
            </Text>
        </View>
    </>
);

const styles = StyleSheet.create({
    // Advice Card Styling 
    adviceCard: {
        marginBottom: 15,
    },
     sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        paddingHorizontal: 15,
        marginBottom: 10,
    },
    separator: {
        height: 1,
        backgroundColor: '#e0e0e0',
        marginVertical: 15,
    },
    
    // Base Card Styling 
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
    // Advice Item Styling (Used by MarketAdviceItem component)
    adviceItem: {
        flexDirection: 'row',
        marginBottom: 15,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    adviceIcon: {
        marginRight: 10,
        marginTop: 2,
    },
    adviceContent: {
        flex: 1,
    },
    adviceTime: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#555',
        marginBottom: 4,
    },
    adviceText: {
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
    },
    adviceFooter: {
        marginTop: 10,
        fontSize: 11,
        color: '#999',
        textAlign: 'right',
    },
});



