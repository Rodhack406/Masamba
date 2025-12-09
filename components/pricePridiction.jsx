import { useState } from 'react';
import {
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// --- PricePredictionCard Component ---
const PricePredictionCard = ({ isSubscribed, pricePredictions, onToggleSubscription }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    // --- Unsubscribed View (The original 'Pro Feature' card) ---
    const renderUnsubscribedCard = () => (
        <>
            <Text style={styles.sectionTitle}>Farmer Pro Tools</Text>
            <View style={[styles.cardBase, styles.proFeatureCard]}>
                <View style={styles.proFeatureHeader}>
                    <Icon name="medal" size={24} color="#FFD700" />
                    <Text style={styles.proFeatureTitle}>Advanced Predictive Analytics</Text>
                    {/* Add a toggle for easy testing */}
                    <TouchableOpacity onPress={onToggleSubscription} style={{ marginLeft: 'auto' }}>
                        <Text style={{ color: '#4CAF50', fontWeight: 'bold' }}>Subscribe</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.proFeatureDescription}>
                    Unlock 48-hour price forecasts, Optimal Transport Time advice, and Regional Supply Heatmaps to maximize your profit and minimize waste.
                </Text>
                <TouchableOpacity style={styles.subscribeButton}>
                    <Text style={styles.subscribeButtonText}>
                        Start 7-Day Free Trial
                    </Text>
                </TouchableOpacity>
            </View>
        </>
    );

    // --- Subscribed View (Functional Prediction List with 'See More') ---
    const renderSubscribedCard = () => {
        // Show only the top 3 predictions for the initial view
        const displayPredictions = pricePredictions.slice(0, 3);

        const getTrendStyle = (trend) => {
            switch (trend) {
                case 'up':
                    return styles.upTrend;
                case 'down':
                    return styles.downTrend;
                default:
                    return styles.stableTrend;
            }
        };

        const getTrendIcon = (trend) => {
            switch (trend) {
                case 'up':
                    return { name: 'arrow-top-right', color: styles.upTrend.color };
                case 'down':
                    return { name: 'arrow-bottom-left', color: styles.downTrend.color };
                default:
                    return { name: 'equal', color: styles.stableTrend.color };
            }
        };

        return (
            <>
                <Text style={styles.sectionTitle}>Price Forecast (Next 24h)</Text>
                <View style={styles.cardBase}>
                    {/* Header Row */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 5, borderBottomWidth: 1, borderBottomColor: '#eee' }}>
                        <Text style={{ flex: 3, fontWeight: 'bold' }}>Commodity</Text>
                        <Text style={{ flex: 2, fontWeight: 'bold', textAlign: 'right' }}>Today (ZMW)</Text>
                        <Text style={{ flex: 1.5, fontWeight: 'bold', textAlign: 'right' }}>Trend (24h)</Text>
                    </View>

                    {/* Prediction List */}
                    {displayPredictions.map((item, index) => {
                        const icon = getTrendIcon(item.trend);
                        return (
                            <View key={index} style={styles.predictionRow}>
                                <Text style={styles.predictionCommodity}>{item.name}</Text>
                                <Text style={styles.predictionValue}>{item.today}</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1.5, justifyContent: 'flex-end' }}>
                                    <Icon name={icon.name} size={16} color={icon.color} />
                                    <Text style={[styles.trendText, getTrendStyle(item.trend), { marginLeft: 4 }]}>
                                        {item.trend.toUpperCase()}
                                    </Text>
                                </View>
                            </View>
                        );
                    })}

                    {/* See More Button */}
                    <TouchableOpacity style={styles.seeMoreButton} onPress={() => setIsModalVisible(true)}>
                        <Text style={styles.seeMoreText}>See 48-Hour Forecast for All</Text>
                        <Icon name="arrow-right-circle" size={18} color="#4CAF50" style={{ marginLeft: 5 }} />
                    </TouchableOpacity>
                </View>
                
                <Modal
                    visible={isModalVisible}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setIsModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Full Price Predictions</Text>
                                <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                                    <Icon name="close-circle" size={30} color="#999" />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.modalTable}>
                                {/* Table Header */}
                                <View style={styles.modalHeaderRow}>
                                    <Text style={[styles.modalHeaderCell, styles.modalCommodityCell]}>Commodity</Text>
                                    <Text style={[styles.modalHeaderCell, styles.modalValueCell]}>Today</Text>
                                    <Text style={[styles.modalHeaderCell, styles.modalValueCell]}>24 Hrs</Text>
                                    <Text style={[styles.modalHeaderCell, styles.modalValueCell]}>48 Hrs</Text>
                                </View>
                                
                                {/* Table Body */}
                                <FlatList
                                    data={pricePredictions}
                                    keyExtractor={(item) => item.name}
                                    renderItem={({ item }) => (
                                        <View style={styles.modalBodyRow}>
                                            <Text style={[styles.modalCell, styles.modalCommodityCell]}>{item.name}</Text>
                                            <Text style={[styles.modalCell, styles.modalValueCell]}>{item.today}</Text>
                                            <Text style={[styles.modalCell, styles.modalValueCell]}>{item['24h']}</Text>
                                            <Text style={[styles.modalCell, styles.modalValueCell]}>{item['48h']}</Text>
                                        </View>
                                    )}
                                />
                            </View>
                        </View>
                    </View>
                </Modal>
            </>
        );
    };

    return isSubscribed ? renderSubscribedCard() : renderUnsubscribedCard();
};

const styles = StyleSheet.create({
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        paddingHorizontal: 15,
        marginBottom: 10,
        marginTop: 10
    },
    
    // Base Card Styling 
    cardBase: {
        marginHorizontal: 15,
        padding: 15,
        borderRadius: 12,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    
    // Pro Feature Card Styling (Unsubscribed)
    proFeatureCard: {
        backgroundColor: '#E8F5E9',
        borderColor: '#4CAF50',
        borderWidth: 1,
        marginBottom: 20,
    },
    proFeatureHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    proFeatureTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1B5E20',
        marginLeft: 10,
    },
    proFeatureDescription: {
        fontSize: 14,
        color: '#388E3C',
        marginBottom: 15,
        lineHeight: 20,
    },
    subscribeButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#388E3C',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    subscribeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    
    // Subscribed/Functional Card Styles
    predictionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        alignItems: 'center',
    },
    predictionCommodity: {
        fontSize: 14,
        color: '#555',
        flex: 3,
    },
    predictionValue: {
        fontSize: 14,
        fontWeight: 'bold',
        flex: 2,
        textAlign: 'right',
    },
    trendText: {
        fontSize: 12,
        fontWeight: '600',
        flex: 1.5,
        textAlign: 'right',
    },
    upTrend: {
        color: '#4CAF50', 
    },
    downTrend: {
        color: '#F44336', 
    },
    stableTrend: {
        color: '#FF9800', 
    },
    
    // See More Button
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

    // Modal Styles
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    modalTable: {
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
    },
    modalHeaderRow: {
        flexDirection: 'row',
        backgroundColor: '#f0f0f0',
        paddingVertical: 10,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    modalHeaderCell: {
        fontWeight: 'bold',
        fontSize: 13,
        color: '#555',
        textAlign: 'center',
    },
    modalBodyRow: {
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    modalCell: {
        fontSize: 13,
        color: '#333',
        textAlign: 'center',
    },
    modalCommodityCell: {
        flex: 3,
        textAlign: 'left',
    },
    modalValueCell: {
        flex: 2,
    },
});

export default PricePredictionCard;