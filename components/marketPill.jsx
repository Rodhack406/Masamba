import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity
} from 'react-native';
// Ensure you have react-native-vector-icons installed:
// npx expo install react-native-vector-icons

const screenWidth = Dimensions.get('window').width;

// =========================================================================
// 1. COMPONENT EXPORT (MUST be named export based on how it's used elsewhere)
// =========================================================================
export const MarketPill = ({ market, isSelected, onPress }) => (
    <TouchableOpacity
        style={[
            styles.marketPill,
            isSelected && styles.selectedMarketPill,
        ]}
        onPress={onPress}
        accessibilityLabel={`Select ${market.name}`}
        accessibilityRole="button"
    >
        <Text style={[
            styles.marketPillText,
            isSelected && styles.selectedMarketPillText,
        ]}>
            {market.name}
        </Text>
    </TouchableOpacity>
);

// =========================================================================
// 2. STYLES DEFINITION (MUST be defined within this file)
// =========================================================================
const styles = StyleSheet.create({
    // Market List Styling (Pill styles)
    marketList: {
        marginBottom: 10,
    },
    marketPill: {
        paddingHorizontal: 15, 
        paddingVertical: 7,    
        borderRadius: 20,
        backgroundColor: '#e0e8f9', 
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#e0e8f9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 1,
    },
    selectedMarketPill: {
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
    },
    marketPillText: {
        color: '#4CAF50', 
        fontSize: 14,     
        fontWeight: '600',
    },
    selectedMarketPillText: {
        color: '#fff', 
        fontSize: 14,
        fontWeight: 'bold',
    },
});
