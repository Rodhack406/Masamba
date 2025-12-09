import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// --- Price Data (Realistic ZMW Estimates based on market context) ---
const BIOCHAR_PRICES = [
    { size: '25 kg Bag', price: 'ZMW 150.00' },
    { size: '50 kg Bag', price: 'ZMW 300.00' },
    { size: '100 kg Bag', price: 'ZMW 600.00' },
];
/**
 * Sub-Component 1: Biochar Purchase Info Modal
 */
const BiocharInfoModal = ({ isVisible, onClose }) => (
    <Modal visible={isVisible} animationType="slide" onRequestClose={onClose}>
        <SafeAreaView style={modalStyles.safeArea}>
            <ScrollView contentContainerStyle={modalStyles.container}>
                <Text style={modalStyles.header}>🌱 Our Biochar: Soil Regeneration</Text>
                
                <Text style={modalStyles.contentTitle}>What it Does</Text>
                <Text style={modalStyles.content}>
                    Agro SoilRegen Biochar is a stable, high-carbon soil amendment produced from farm waste. 
                    It is essential for improving water retention and boosting nutrient efficiency in Zambia's varied soil types, helping you use less fertilizer and irrigation over time.
                </Text>

                <Text style={modalStyles.contentTitle}>Pricing & Sales</Text>
                <View style={modalStyles.priceTable}>
                    {BIOCHAR_PRICES.map((item, index) => (
                        <View key={index} style={modalStyles.priceRow}>
                            <Text style={modalStyles.priceCellSize}>{item.size}</Text>
                            <Text style={modalStyles.priceCellValue}>{item.price}</Text>
                        </View>
                    ))}
                    <Text style={modalStyles.smallText}>
                        *Bulk orders (1 Ton+) qualify for a 10% discount and free delivery within 50km of Lusaka/Copperbelt hubs.
                    </Text>
                </View>

                <TouchableOpacity style={modalStyles.closeButton} onPress={onClose}>
                    <Text style={modalStyles.closeButtonText}>
                        <MaterialCommunityIcons name="check-circle-outline" size={18} color="#FFFFFF" /> Back to Main Page
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    </Modal>
);

/**
 * Sub-Component 2: Waste Buyback/Service Info Modal
 */
const WasteBuybackModal = ({ isVisible, onClose }) => (
    <Modal visible={isVisible} animationType="slide" onRequestClose={onClose}>
        <SafeAreaView style={modalStyles.safeArea}>
            <ScrollView contentContainerStyle={modalStyles.container}>
                <Text style={modalStyles.header}>♻️ Farm Residue Buyback & Service</Text>
                
                <Text style={modalStyles.contentTitle}>What We Buy</Text>
                <Text style={modalStyles.content}>
                    We purchase post-harvest biomass waste: Maize cobs, groundnut shells, cotton stalks, and sawmill waste. 
                    This is your waste stream turned into a new revenue source.
                </Text>

                <Text style={modalStyles.contentTitle}>Partner Options</Text>
                <View style={modalStyles.optionBox}>
                    <Text style={modalStyles.optionTitle}>Option 1: Cash Buyback</Text>
                    <Text style={modalStyles.optionDetail}>
                        We pay you ZMW per tonne of dried residue delivered to our pyrolysis unit.
                        Estimated price range: ZMW 500 - ZMW 800 per tonne (depending on quality/feedstock).
                    </Text>
                </View>
                <View style={modalStyles.optionBox}>
                    <Text style={modalStyles.optionTitle}>Option 2: Biochar Service (Toll Pyrolysis)</Text>
                    <Text style={modalStyles.optionDetail}>
                        We process your farm waste into biochar for you at a cheap, fixed service rate. 
                        You get 100% of the finished biochar, ensuring your farm receives high-quality, local product at the lowest possible cost.
                    </Text>
                </View>


                <TouchableOpacity style={modalStyles.closeButton} onPress={onClose}>
                    <Text style={modalStyles.closeButtonText}>
                        <MaterialCommunityIcons name="check-circle-outline" size={18} color="#FFFFFF" /> Back to Main Page
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    </Modal>
);


/**
 * Main Export Component: Contains the Ad Card and manages the Modals
 */
export default function BiocharBusinessModule() {
    const [isBiocharModalVisible, setBiocharModalVisible] = useState(false);
    const [isWasteModalVisible, setWasteModalVisible] = useState(false);

    // Handlers
    const openBiocharModal = () => setBiocharModalVisible(true);
    const closeBiocharModal = () => setBiocharModalVisible(false);

    const openWasteModal = () => setWasteModalVisible(true);
    const closeWasteModal = () => setWasteModalVisible(false);

    return (
        <View style={{ width: '100%', alignItems: 'center' }}>
            {/* --- The Main Card Component (Advertisement) --- */}
            <View style={styles.card}>
                
                {/* --- Section 1: Buy Biochar --- */}
                <View style={styles.sectionContainer}>
                    <View style={styles.titleRow}>
                        <MaterialCommunityIcons name="basket-fill" size={24} color="#4CAF50" />
                        <Text style={styles.sectionTitle}>Buy Agro SoilRegen Biochar</Text>
                    </View>
                    
                    <Text style={styles.subText}>
                        Revitalize your soil with our premium, high-carbon biochar.
                    </Text>

                    {/* Price List */}
                    <View style={styles.priceContainer}>
                        {BIOCHAR_PRICES.map((item, index) => (
                            <View key={index} style={styles.priceItem}>
                                <Text style={styles.priceSize}>{item.size}:</Text>
                                <Text style={styles.priceValue}>{item.price}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Learn More Button for Buying */}
                    <TouchableOpacity 
                        style={[styles.button, styles.buyButton]}
                        onPress={openBiocharModal} // Open Biochar Info Modal
                    >
                        <Text style={styles.buttonText}>Learn More & Full Pricing</Text>
                    </TouchableOpacity>
                </View>

                {/* --- Separator --- */}
                <View style={styles.separator} />

                {/* --- Section 2: Sell Waste / Toll Pyrolysis --- */}
                <View style={styles.sectionContainer}>
                    <View style={styles.titleRow}>
                        <MaterialCommunityIcons name="piggy-bank" size={24} color="#4CAF50" />
                        <Text style={styles.sectionTitle}>Sell Us Your Farm Residue</Text>
                    </View>

                    <Text style={styles.subText}>
                        Turn maize cobs, stalks, or shells into cash or discounted biochar.
                    </Text>
                    
                    {/* Learn More Button for Selling/Service */}
                    <TouchableOpacity 
                        style={[styles.button, styles.sellButton]}
                        onPress={openWasteModal} // Open Waste Info Modal
                    >
                        <Text style={styles.buttonText}>How We Buy & Partner Options</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* --- Modal Renders (The reusable screens) --- */}
            <BiocharInfoModal isVisible={isBiocharModalVisible} onClose={closeBiocharModal} />
            <WasteBuybackModal isVisible={isWasteModalVisible} onClose={closeWasteModal} />
        </View>
    );
}

// --- Card Stylesheet ---
const styles = StyleSheet.create({
    card: {
        width: '100%',
        maxWidth: 500, 
        borderRadius: 12,
        padding: 16,
        marginVertical: 15,

    },
    sectionContainer: {
        paddingVertical: 10,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#4CAF50',
        marginLeft: 8,
    },
    subText: {
        fontSize: 14,
        color: '#4B5563',
        marginBottom: 10,
    },
    priceContainer: {
        marginBottom: 15,
        paddingHorizontal: 10,
        backgroundColor: '#F7FEE7', // Light green background for prices
        borderRadius: 6,
        padding: 8,
    },
    priceItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 4,
        borderBottomWidth: 1,
        borderBottomColor: '#ECFDF5',
    },
    priceSize: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1F2937',
    },
    priceValue: {
        fontSize: 15,
        fontWeight: '800', // Extra bold for ZMW price
        color: '#065F46',
    },
    button: {
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buyButton: {
        backgroundColor: '#4CAF50', // Emerald Green for buying
    },
    sellButton: {
        backgroundColor: '#FBBF24', // Amber/Yellow for partnering/selling
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
    },
    separator: {
        height: 1,
        backgroundColor: '#D1D5DB',
        marginVertical: 10,
    }
});

// --- Modal Stylesheet (Shared styles for both pop-up screens) ---
const modalStyles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    container: {
        flexGrow: 1,
        padding: 20,
        paddingTop: 30,
    },
    header: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginBottom: 20,
        borderBottomWidth: 3,
        borderBottomColor: '#A7F3D0',
        paddingBottom: 10,
    },
    contentTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#047857',
        marginTop: 15,
        marginBottom: 5,
    },
    content: {
        fontSize: 15,
        lineHeight: 24,
        color: '#374151',
        marginBottom: 10,
    },
    priceTable: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#D1FAE5',
        padding: 15,
        marginTop: 10,
        marginBottom: 20,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    priceCellSize: {
        fontSize: 16,
        fontWeight: '500',
        color: '#4B5563',
    },
    priceCellValue: {
        fontSize: 16,
        fontWeight: '800',
        color: '#065F46',
    },
    smallText: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 10,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    optionBox: {
        backgroundColor: '#ECFDF5',
        borderRadius: 8,
        padding: 12,
        marginBottom: 15,
        borderLeftWidth: 4,
        borderLeftColor: '#34D399',
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginBottom: 5,
    },
    optionDetail: {
        fontSize: 14,
        color: '#4CAF50',
        lineHeight: 20,
    },
    closeButton: {
        paddingVertical: 12,
        backgroundColor: '#4CAF50',
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    closeButtonText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 16,
    }
});