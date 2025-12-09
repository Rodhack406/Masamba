import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const CommodityPriceList = ({ marketName, commodityPrices, showAllPrices, setShowAllPrices }) => {
    const pricesToShow = showAllPrices
        ? commodityPrices
        : commodityPrices.filter(p => !p.hidden);

    return (
        <>
            <Text style={styles.sectionTitle}>Commodity Prices - {marketName}</Text>
            <View style={[styles.cardBase, styles.pricesCard]}>
                {pricesToShow.map((item, index) => (
                    <View key={index} style={styles.priceItem}>
                        <View>
                            <Text style={styles.commodityName}>
                                {item.name.split(' (')[0]}
                            </Text>
                            <Text style={styles.unitText}>
                                Per {item.unit}
                            </Text>
                        </View>
                        <View style={styles.priceDetails}>
                            <Text style={styles.priceText}>
                                K{item.price.toFixed(2)}
                            </Text>
                            <Text style={item.change.startsWith('+') ? styles.positiveChangeSmall : item.change.startsWith('-') ? styles.negativeChangeSmall : styles.noChange}>
                                {item.change}
                            </Text>
                        </View>
                    </View>
                ))}

                {/* See More Button - Enhanced UX */}
                {commodityPrices.some(p => p.hidden) && (
                    <TouchableOpacity
                        style={styles.seeMoreButton}
                        onPress={() => setShowAllPrices(prev => !prev)}
                        accessibilityLabel={showAllPrices ? 'Show fewer prices' : 'Show all prices'}
                    >
                        <Icon name={showAllPrices ? "chevron-up" : "chevron-down"} size={20} color="#1a73e8" />
                        <Text style={styles.seeMoreText}>
                            {showAllPrices ? 'Hide Additional Prices' : 'View All Commodity Prices'}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    // Prices Card Styling 
    container: {
        flex: 1,
        backgroundColor: '#f5f7fa',
    },
    scrollContent: {
        paddingVertical: 15,
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
    pricesCard: {
        marginBottom: 15,
    },
    priceItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    commodityName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    unitText: {
        fontSize: 12,
        color: '#777',
        marginTop: 2,
    },
    priceDetails: {
        alignItems: 'flex-end',
    },
    priceText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    positiveChangeSmall: {
        color: '#4CAF50',
        fontSize: 13,
    },
    negativeChangeSmall: {
        color: '#F44336',
        fontSize: 13,
    },
    noChange: {
        color: '#777',
        fontSize: 13,
    },
    
    // See More Button - Enhanced UX
    seeMoreButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        marginTop: 5,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        backgroundColor: '#f9f9ff',
        borderRadius: 8,
    },
    seeMoreText: {
        color: '#4CAF50',
        fontWeight: 'bold',
        marginLeft: 5,
        fontSize: 14,
    },

});

