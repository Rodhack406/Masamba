import { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AppHeader from '../../components/appHeader';
import { MarketAdviceInsight } from '../../components/marketAdvice';
import { MarketPill } from '../../components/marketPill';
import { CommodityPriceList } from '../../components/priceList';
import PricePredictionCard from '../../components/pricePridiction';
const screenWidth = Dimensions.get('window').width;

// Mock Data for Price Predictions
const pricePredictionsData = [
    { name: 'Tomatoes (Box)', today: 180, '24h': 195, '48h': 205, trend: 'up' },
    { name: 'Rape (Sack)', today: 95, '24h': 90, '48h': 85, trend: 'down' },
    { name: 'Onions (Bag)', today: 120, '24h': 120, '48h': 122, trend: 'stable' },
    { name: 'Potatoes (Sack)', today: 85, '24h': 92, '48h': 98, trend: 'up' },
    { name: 'Oranges (Box)', today: 210, '24h': 215, '48h': 220, trend: 'up' },
];

// Commodity Market Valuation Data (Simulates real-time change)
const initialGraphData = [
    { time: '09:00', value: 450000 },
    { time: '10:00', value: 455000 },
    { time: '11:00', value: 448000 },
    { time: '12:00', value: 452000 },
    { time: '13:00', value: 460000 },
];

// Market Insights Data (Per Market)
const marketsData = [
    {
        id: 'soweto',
        name: 'Soweto Market',
        commodityPrices: [
            { name: 'Tomatoes (Box)', price: 180, unit: 'Box', change: '+2.5%' },
            { name: 'Rape (Sack)', price: 95, unit: 'Sack', change: '-1.0%' },
            { name: 'Onions (Bag)', price: 120, unit: 'Bag', change: '0%' },
            { name: 'Oranges (Box)', price: 210, unit: 'Box', hidden: true },
            { name: 'Potatoes (Sack)', price: 85, unit: 'Sack', hidden: true },
        ],
        marketAdvice: [
            { time: '06:00', insight: '2 Tracks of Tomatoes arrived. Supply is high, expect stable prices.' },
            { time: '07:30', insight: 'One van of fresh Cabbages (Chicombo Variety) arrived. Good stock of leafy greens.' },
            { time: '09:00', insight: 'Oranges completely out of stock since last night. Traders are sourcing from outside the city.' },
        ],
    },
    {
        id: 'chilenje',
        name: 'Chilenje Market',
        commodityPrices: [
            { name: 'Tomatoes (Box)', price: 185, unit: 'Box', change: '+1.0%' },
            { name: 'Rape (Sack)', price: 90, unit: 'Sack', change: '-2.0%' },
        ],
        marketAdvice: [
            { time: '08:00', insight: 'Light demand for fresh fruits. Advisable to offload perishable stock early.' },
        ],
    },
];

const Home = () => {
    const [selectedMarketId, setSelectedMarketId] = useState('soweto');
    const [graphData, setGraphData] = useState(initialGraphData);
    const [showAllPrices, setShowAllPrices] = useState(false);
    
    // NEW STATE: Set this to true/false to test the two different views
    const [isSubscribed, setIsSubscribed] = useState(true); 

    // Simulate Real-Time Data Update
    useEffect(() => {
        const interval = setInterval(() => {
            setGraphData(prevData => {
                const lastValue = prevData[prevData.length - 1].value;
                const newValue = Math.round(lastValue + (Math.random() * 10000 - 5000));
                const newTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                return [...prevData.slice(-4), { time: newTime, value: newValue }];
            });
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    const selectedMarket = marketsData.find(m => m.id === selectedMarketId);

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <AppHeader />
                {/* 1. Price Prediction Component (REUSABLE COMPONENT) */}
                <PricePredictionCard 
                    isSubscribed={isSubscribed}
                    pricePredictions={pricePredictionsData}
                    onToggleSubscription={() => setIsSubscribed(prev => !prev)} // Added for easy testing
                />

                <View style={styles.separator} />

                {/* 2. Horizontal Market Selector (Reusable) */}
                <Text style={styles.sectionTitle}>Markets</Text>
                <FlatList
                    data={marketsData}
                    renderItem={({ item }) => (
                        <MarketPill
                            market={item}
                            isSelected={item.id === selectedMarketId}
                            onPress={() => {
                                setSelectedMarketId(item.id);
                                setShowAllPrices(false);
                            }}
                        />
                    )}
                    keyExtractor={item => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.marketList}
                />

                <View style={styles.separator} />

                {/* 3. Market Insight Section */}
                {selectedMarket && (
                    <View style={styles.insightSection}>
                        
                        {/* 3a. Commodity Prices List (REUSABLE COMPONENT) */}
                        <CommodityPriceList
                            marketName={selectedMarket.name}
                            commodityPrices={selectedMarket.commodityPrices}
                            showAllPrices={showAllPrices}
                            setShowAllPrices={setShowAllPrices}
                        />

                        <View style={styles.separator} />

                        {/* 3b. Market Advice Insight (REUSABLE COMPONENT) */}
                        <MarketAdviceInsight
                            marketAdvice={selectedMarket.marketAdvice}
                        />
                        
                        <View style={styles.separator} />
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
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
        color: '#1a73e8',
        fontWeight: 'bold',
        marginLeft: 5,
        fontSize: 14,
    },
});

export default Home;