import { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert // Required for Speech errors
    ,





    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Expo Modules ---
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
// You will need to install 'expo-speech' for the TTS feature
import * as Speech from 'expo-speech';
// Audio is imported but not explicitly used in this component's logic

// Constants
const API_URL = 'https://api.open-meteo.com/v1/forecast';

// --- Helper Functions ---

/**
 * Maps Open-Meteo's WMO Weather codes to a descriptive icon name from 
 * the MaterialCommunityIcons set for a native feel.
 */
const getWeatherIcon = (code) => {
    let iconName = 'weather-cloud-question';
    let description = 'Unknown';
    
    // Clear Sky (0), Mainly clear (1)
    if (code >= 0 && code <= 1) {
        iconName = 'weather-sunny';
        description = 'Clear Sky';
    }
    // Partly cloudy (2), Overcast (3)
    else if (code >= 2 && code <= 3) {
        iconName = 'weather-cloudy';
        description = 'Cloudy';
    }
    // Fog and depositing rime fog (45-48)
    else if (code >= 45 && code <= 48) {
        iconName = 'weather-fog';
        description = 'Foggy';
    }
    // Drizzle (51-55)
    else if (code >= 51 && code <= 55) {
        iconName = 'weather-partly-rainy';
        description = 'Drizzle';
    }
    // Rain (61-65), Showers (80-82)
    else if ((code >= 61 && code <= 65) || (code >= 80 && code <= 82)) {
        iconName = 'weather-pouring';
        description = 'Rain';
    }
    // Snowfall (71-75)
    else if (code >= 71 && code <= 75) {
        iconName = 'weather-snowy';
        description = 'Snowfall';
    }
    // Thunderstorm (95-99)
    else if (code >= 95 && code <= 99) {
        iconName = 'weather-lightning-rainy';
        description = 'Thunderstorm';
    }

    return { icon: iconName, description };
};

// --- Sub-Components (React Native) ---

const IconMetricBox = ({ iconName, label, value }) => (
    <View style={styles.metricBoxContainer}>
        <MaterialCommunityIcons name={iconName} size={24} color="#047857" style={styles.metricBoxIcon} />
        <Text style={styles.metricBoxValue}>{value}</Text>
        <Text style={styles.metricBoxLabel}>{label}</Text>
    </View>
);

const IconInsightMetric = ({ iconName, label, value, isHighlight }) => (
    <View style={insightModalStyles.insightMetricContainer}>
        <MaterialCommunityIcons name={iconName} size={20} color="#065F46" style={insightModalStyles.insightMetricIcon} />
        <Text style={[insightModalStyles.insightMetricValue, isHighlight && insightModalStyles.highlightText]}>
            {value}
        </Text>
        <Text style={insightModalStyles.insightMetricLabel}>{label}</Text>
    </View>
);

/**
 * NEW: Generates dynamic farming advice based on weather data
 */
const getFarmingAdvice = (data) => {
    const advice = [];
    const isRainy = data.precipitationSum > 10 || data.maxRainProb > 60; // Over 10mm or 60% chance
    const isHot = data.maxTemp > 35;
    const isCold = data.minTemp < 10;
    const isWindy = data.maxWindGust > 30; // Over 30 km/h is significantly windy

    if (isRainy) {
        advice.push({ 
            icon: 'weather-pouring', 
            text: `Heavy rain expected (up to ${data.precipitationSum} mm). **POSTPONE SPRAYING** or soil preparations that require a dry period. Focus on drainage checks.` 
        });
    } else if (data.precipitationSum > 0) {
        advice.push({ 
            icon: 'water-check', 
            text: 'Light to moderate rain is likely. **Good day for natural watering**. Check soil moisture before irrigating.' 
        });
    } else {
        advice.push({ 
            icon: 'watering-can', 
            text: 'No significant rain expected. **Plan for irrigation** to meet crop water needs.' 
        });
    }

    if (isHot) {
        advice.push({ 
            icon: 'sun-thermometer-outline', 
            text: `High temperatures expected (${data.maxTemp}°C). **Limit physical labour** to early morning/late afternoon. Monitor plants for heat stress.` 
        });
    } else if (isCold) {
        advice.push({ 
            icon: 'snowflake', 
            text: `Cold temperatures (${data.minTemp}°C). **Protect tender seedlings** if necessary. Soil may be too cold for optimal germination.` 
        });
    }

    if (isWindy) {
        advice.push({ 
            icon: 'weather-windy', 
            text: `Strong wind gusts expected (${data.maxWindGust} km/h). **AVOID SPRAYING** as drift will be significant. Secure any temporary structures or young trees.` 
        });
    } else {
          advice.push({ 
            icon: 'tractor', 
            text: `Light wind is favorable for **pesticide/herbicide application** if required today.` 
        });
    }
    
    // Generic recommendation based on current/predicted conditions
    if (!isRainy && !isWindy && !isHot && !isCold) {
        advice.push({ 
            icon: 'check-all', 
            text: 'Optimal conditions for general farming activities, planting, and tillage.' 
        });
    }

    return advice;
};


/**
 * NEW: Farm Insight Modal Component
 */
const FarmInsightModal = ({ isVisible, onClose, weatherData }) => {
    // NEW: State for TTS
    const [isSpeakingInsight, setIsSpeakingInsight] = useState(false);

    if (!weatherData || !weatherData.dailyInsight) return null;

    const todayInsight = weatherData;
    const tomorrowInsight = weatherData.dailyInsight;

    const todayAdvice = getFarmingAdvice({ 
        maxTemp: todayInsight.currentTemp, 
        minTemp: todayInsight.currentTemp, 
        precipitationSum: todayInsight.current.precipitation * 24, // Assuming precipitation is mm/h, rough 24h estimate
        maxRainProb: 0, // Not available for current data
        maxWindGust: todayInsight.current.wind_speed_10m
    });

    const tomorrowAdvice = getFarmingAdvice(tomorrowInsight);
    
    // Helper to generate a clean, spoken text string from advice array
    const generateAdviceText = (adviceArray, header) => {
        if (!adviceArray || adviceArray.length === 0) return "";
        
        let text = `${header}: `;
        adviceArray.forEach(item => {
            // Replace markdown **bold** with plain text
            text += item.text.replace(/\*\*(.*?)\*\*/g, (match, p1) => p1) + ". ";
        });
        return text;
    };

    // NEW: Function to handle Text-to-Speech for all insights
    const toggleInsightAudio = useCallback(async () => {
        if (!weatherData) return;

        // --- Stop Logic ---
        if (isSpeakingInsight) {
            const speakingStatus = await Speech.isSpeakingAsync();
            if (speakingStatus) {
                Speech.stop();
            }
            setIsSpeakingInsight(false);
            return;
        }

        // --- Start Logic: Generate the full script ---
        
        // 1. Today's Metrics
        const todayMetricsText = `For ${weatherData.locationName}, Today's current temperature is ${todayInsight.currentTemp} degrees Celsius. Wind speed is ${todayInsight.current.wind_speed_10m.toFixed(1)} kilometers per hour. Current rain is ${todayInsight.current.precipitation.toFixed(1)} millimeters per hour. `;
        
        // 2. Today's Advice
        const todayAdviceText = generateAdviceText(todayAdvice, "Today's specific farming recommendations");
        
        // 3. Tomorrow's Metrics
        const tomorrowMetricsText = `Tomorrow's temperature range is from ${tomorrowInsight.minTemp} to ${tomorrowInsight.maxTemp} degrees Celsius. Rain probability is ${tomorrowInsight.maxRainProb} percent. Maximum wind gust predicted is ${tomorrowInsight.maxWindGust} kilometers per hour. `;

        // 4. Tomorrow's Advice
        const tomorrowAdviceText = generateAdviceText(tomorrowAdvice, "Tomorrow's farming recommendations");
        
        const fullText = todayMetricsText + todayAdviceText + tomorrowMetricsText + tomorrowAdviceText;

        try {
            setIsSpeakingInsight(true);
            await Speech.speak(fullText, {
                language: 'en-US',
                onDone: () => setIsSpeakingInsight(false),
                onError: (e) => {
                    console.error("Insight Speech Error:", e);
                    Alert.alert("Audio Error", "Could not read the farming insights.");
                    setIsSpeakingInsight(false);
                }
            });
        } catch (error) {
            console.error("TTS Speak Initialization Error:", error);
            Alert.alert("Setup Error", "Text-to-Speech failed.");
            setIsSpeakingInsight(false);
        }
    }, [isSpeakingInsight, weatherData, todayAdvice, tomorrowAdvice]);


    // Cleanup: Stop speech when the modal is closed or component unmounts
    useEffect(() => {
        return () => {
            Speech.stop(); 
        };
    }, []); 

    // Stop speaking when the modal is closed via the button
    useEffect(() => {
        if (!isVisible && isSpeakingInsight) {
            Speech.stop();
            setIsSpeakingInsight(false);
        }
    }, [isVisible]);

    
    return (
        <Modal visible={isVisible} animationType="slide" onRequestClose={onClose}>
            <SafeAreaView style={insightModalStyles.safeArea}>
                <ScrollView contentContainerStyle={insightModalStyles.container}>
                    
                    <View style={insightModalStyles.header}>
                        <Text style={insightModalStyles.headerTitle}>🌾 Farm Insight & Planning</Text>
                        <Text style={insightModalStyles.headerSubtitle}>{weatherData.locationName}</Text>
                        
                        {/* NEW: Read Aloud Button */}
                        <TouchableOpacity 
                            style={[
                                insightModalStyles.audioButton, 
                                isSpeakingInsight && insightModalStyles.audioButtonActive
                            ]} 
                            onPress={toggleInsightAudio}
                        >
                            <Text style={insightModalStyles.audioButtonText}>
                                <MaterialCommunityIcons 
                                    name={isSpeakingInsight ? 'stop-circle-outline' : 'volume-high'} 
                                    size={18} 
                                    color="#FFFFFF" 
                                /> 
                                {isSpeakingInsight ? ' Stop Reading All' : ' Read All Insights'}
                            </Text>
                        </TouchableOpacity>

                    </View>

                    {/* --- TODAY'S INSIGHT --- */}
                    <Text style={insightModalStyles.sectionTitle}>
                        <MaterialCommunityIcons name="calendar-today" size={20} color="#4CAF50" /> Today's Forecast & Advice
                    </Text>
                    <View style={insightModalStyles.metricRow}>
                        <IconInsightMetric 
                            iconName="thermometer-high" 
                            label="Current Temp" 
                            value={`${todayInsight.currentTemp}°C`} 
                            isHighlight={todayInsight.currentTemp > 35}
                        />
                        <IconInsightMetric 
                            iconName="weather-windy" 
                            label="Wind Speed" 
                            value={`${todayInsight.current.wind_speed_10m.toFixed(1)} km/h`} 
                            isHighlight={todayInsight.current.wind_speed_10m > 25}
                        />
                          <IconInsightMetric 
                            iconName="water-outline" 
                            label="Current Rain" 
                            value={`${todayInsight.current.precipitation.toFixed(1)} mm/h`} 
                            isHighlight={todayInsight.current.precipitation > 0}
                        />
                    </View>
                    <View style={insightModalStyles.adviceBlock}>
                        {todayAdvice.map((item, index) => (
                            <View key={index} style={insightModalStyles.adviceItem}>
                                <MaterialCommunityIcons name={item.icon} size={18} color="#047857" style={{marginRight: 8}} />
                                <Text style={insightModalStyles.adviceText}>{item.text.replace(/\*\*(.*?)\*\*/g, (match, p1) => p1)}</Text>
                            </View>
                        ))}
                    </View>
                    
                    {/* --- TOMORROW'S INSIGHT --- */}
                    <Text style={[insightModalStyles.sectionTitle, {marginTop: 20}]}>
                        <MaterialCommunityIcons name="calendar-arrow-right" size={20} color="#4CAF50" /> Tomorrow's Prediction
                    </Text>
                    <View style={insightModalStyles.metricRow}>
                        <IconInsightMetric 
                            iconName="thermometer-lines" 
                            label="Temp Range" 
                            value={`${tomorrowInsight.minTemp}°C / ${tomorrowInsight.maxTemp}°C`} 
                            isHighlight={tomorrowInsight.maxTemp > 35 || tomorrowInsight.minTemp < 10}
                        />
                        <IconInsightMetric 
                            iconName="weather-pouring" 
                            label="Rain Probability" 
                            value={`${tomorrowInsight.maxRainProb}%`} 
                            isHighlight={tomorrowInsight.maxRainProb > 50}
                        />
                        <IconInsightMetric 
                            iconName="weather-windy-variant" 
                            label="Max Wind Gust" 
                            value={`${tomorrowInsight.maxWindGust} km/h`} 
                            isHighlight={tomorrowInsight.maxWindGust > 30}
                        />
                    </View>

                    <View style={insightModalStyles.adviceBlock}>
                        {tomorrowAdvice.map((item, index) => (
                               <View key={index} style={insightModalStyles.adviceItem}>
                                   <MaterialCommunityIcons name={item.icon} size={18} color="#047857" style={{marginRight: 8}} />
                                   <Text style={insightModalStyles.adviceText}>{item.text.replace(/\*\*(.*?)\*\*/g, (match, p1) => p1)}</Text>
                               </View>
                        ))}
                    </View>
                    
                    <TouchableOpacity style={insightModalStyles.closeButton} onPress={onClose}>
                        <Text style={insightModalStyles.closeButtonText}>
                            <MaterialCommunityIcons name="arrow-collapse-down" size={18} color="#FFFFFF" /> Close Insights
                        </Text>
                    </TouchableOpacity>
                    
                </ScrollView>
            </SafeAreaView>
        </Modal>
    );
};


// --- Main Component (Not changed, just wrapped) ---

export default function WeatherFarmInsight() {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null);
    const [isInsightModalVisible, setIsInsightModalVisible] = useState(false); // NEW STATE for Modal

    const fetchLocationAndWeather = useCallback(async () => {
        setLoading(true);
        setErrorMsg(null);

        try {
            // ... (Location and Weather fetching logic remains the same) ...
              let { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                setErrorMsg('Location permission denied. Please enable it in settings to get local weather.');
                setLoading(false);
                return;
            }

            let location = await Location.getCurrentPositionAsync({ 
                accuracy: Location.Accuracy.High,
                timeout: 10000, 
            });
            const { latitude, longitude } = location.coords;

            let city = `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`;
            try {
                let geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
                if (geocode && geocode.length > 0) {
                    const place = geocode[0];
                    city = `${place.city || place.subregion || 'Unknown City'}, ${place.country || 'Unknown'}`;
                }
            } catch (e) {
                console.warn("Reverse geocoding failed, using coordinates:", e);
            }
            
            // FIX: Removed the extra ': longitude' from the longitude parameter definition.
            const weatherQuery = new URLSearchParams({
                latitude: latitude,
                longitude: longitude, 
                current: 'temperature_2m,weather_code,wind_speed_10m,precipitation,apparent_temperature',
                daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_gusts_10m_max',
                timezone: 'auto',
                units: 'metric' 
            }).toString();

            const response = await fetch(`${API_URL}?${weatherQuery}`);
            if (!response.ok) {
                throw new Error('Failed to fetch weather data from API.');
            }
            const data = await response.json();
            
            const weatherInfo = getWeatherIcon(data.current.weather_code);
            
            setWeatherData({
                ...data,
                locationName: city,
                currentTemp: Math.round(data.current.temperature_2m),
                currentApparentTemp: Math.round(data.current.apparent_temperature),
                windSpeed: data.current.wind_speed_10m.toFixed(1),
                currentDescription: weatherInfo.description,
                currentIcon: weatherInfo.icon,
                // Daily insight for the next day (index 1)
                dailyInsight: data.daily.precipitation_probability_max[1] !== undefined ? {
                    maxTemp: Math.round(data.daily.temperature_2m_max[1]),
                    minTemp: Math.round(data.daily.temperature_2m_min[1]),
                    maxRainProb: data.daily.precipitation_probability_max[1],
                    maxWindGust: data.daily.wind_gusts_10m_max[1].toFixed(1),
                    precipitationSum: data.daily.precipitation_sum[1] ? data.daily.precipitation_sum[1].toFixed(1) : 0,
                    dayName: 'Tomorrow'
                } : null 
            });

        } catch (error) {
            let errorText = 'An unknown error occurred.';
            if (error.message.includes("Permission denied")) {
                errorText = 'Location permission denied. Please grant access.';
            } else if (error.message.includes("fetch") || error.message.includes("network")) {
                errorText = 'Could not reach weather service. Check your connection.';
            } else if (error.message.includes("timeout")) {
                 errorText = 'Location fetch timed out. Try again or check device settings.';
            } else {
                errorText = error.message;
            }

            console.error("Location/Weather Error:", error);
            setErrorMsg(`Could not load weather: ${errorText}`);
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial data fetch effect
    useEffect(() => {
        fetchLocationAndWeather();
    }, [fetchLocationAndWeather]);

    // --- Loading & Error States ---
    if (loading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={[styles.container, styles.loadingContainer]}>
                    <ActivityIndicator size="large" color="#4CAF50" /> 
                    <Text style={styles.loadingText}>Fetching real-time data...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (errorMsg || !weatherData) {
          return (
            <View style={[styles.container, styles.errorCard]}>
                <Text style={styles.errorTitle}>⚠️ Error Loading Data</Text>
                <Text style={styles.errorText}>{errorMsg || "No weather data available."}</Text>
                <TouchableOpacity 
                    onPress={fetchLocationAndWeather} 
                    style={styles.errorButton}
                >
                    <Text style={styles.errorButtonText}>Try Again</Text>
                </TouchableOpacity>
            </View>
        );
    }
    
    // --- Render Component ---

    const { currentIcon, currentTemp, currentDescription, locationName, windSpeed, currentApparentTemp } = weatherData;

    return (
        // The ScrollView is only for the content inside the component
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.card}>
                
                {/* Header: Location and Refresh */}
                <View style={styles.headerRow}>
                    <View>
                        <Text style={styles.locationTitle}>{locationName}</Text>
                        <Text style={styles.locationSubtitle}>Current Real-Time Location</Text>
                    </View>
                    <TouchableOpacity 
                        onPress={fetchLocationAndWeather} 
                        style={styles.refreshIcon}
                    >
                        <MaterialCommunityIcons name="refresh" size={28} color="#4CAF50" />
                    </TouchableOpacity>
                </View>

                {/* Main Weather View */}
                <View style={styles.mainWeatherRow}>
                    <MaterialCommunityIcons 
                        name={currentIcon} 
                        size={80} 
                        color="#10B981" 
                        style={styles.mainIcon} 
                    />
                    <View style={styles.mainTempBlock}>
                        <Text style={styles.currentTempText}>{currentTemp}°C</Text>
                        <Text style={styles.currentDescText}>{currentDescription}</Text>
                    </View>
                </View>

                {/* Key Metrics Row for immediate insight */}
                <View style={styles.keyMetricsRow}>
                    <IconMetricBox iconName="weather-windy" label="Wind Speed" value={`${windSpeed} km/h`} />
                    <IconMetricBox 
                        iconName="water-outline" 
                        label="Precipitation" 
                        value={weatherData.current.precipitation > 0 ? `${weatherData.current.precipitation.toFixed(1)} mm/h` : 'None'} 
                    />
                    <IconMetricBox iconName="thermometer" label="Feels Like" value={`${currentApparentTemp}°C`} />
                </View>
                
                {/* NEW: Gain Insight Button */}
                <View style={styles.insightButtonWrapper}>
                    <TouchableOpacity 
                        onPress={() => setIsInsightModalVisible(true)} 
                        style={styles.insightButton}
                    >
                        <MaterialCommunityIcons name="trending-up" size={18} color="#FFFFFF" />
                        <Text style={styles.insightButtonText}>Gain Farming Insight</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* NEW: Farm Insight Modal */}
            <FarmInsightModal 
                isVisible={isInsightModalVisible} 
                onClose={() => setIsInsightModalVisible(false)}
                weatherData={weatherData}
            />

        </ScrollView>
    );
}

// --- Stylesheet (React Native) ---

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        marginBottom: 0
    },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
        backgroundColor: '#F7FEE7',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0,
    },
    loadingText: {
        marginTop: 8,
        fontSize: 18,
        color: '#4CAF50',
    },
    card: {
        width: '100%',
        maxWidth: 500,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 24,
        borderWidth: 1,
        borderColor: '#4CAF50',
        elevation: 5,
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    headerRow: { // NEW STYLE for the header layout
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 0,
    },
    locationTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    locationSubtitle: {
        fontSize: 12,
        color: '#6B7280',
    },
    refreshIcon: { // NEW STYLE for the icon button
        padding: 8,
    },
    mainWeatherRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ECFDF5',
    },
    mainIcon: {
        marginRight: 20,
    },
    mainTempBlock: {
        justifyContent: 'center',
    },
    currentTempText: {
        fontSize: 60,
        fontWeight: '300',
        color: '#1F2937',
        lineHeight: 65,
    },
    currentDescText: {
        fontSize: 18,
        color: '#4B5563',
        fontWeight: '500',
        marginTop: 4,
    },
    keyMetricsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 16,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#E5E7EB',
        marginBottom: 24,
    },
    metricBoxContainer: {
        alignItems: 'center',
        flex: 1,
        paddingHorizontal: 8,
    },
    metricBoxIcon: {
        marginBottom: 4,
    },
    metricBoxValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
    metricBoxLabel: {
        fontSize: 10,
        color: '#6B7280',
    },

    // Insight Button Styles
    insightButtonWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    insightButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingVertical: 12,
        backgroundColor: '#4CAF50', // Dark Green
        borderRadius: 10,
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6,
    },
    insightButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 8,
    },
    errorCard: {
        backgroundColor: '#FEE2E2',
        borderColor: '#EF4444',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    errorTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#EF4444',
        marginBottom: 10,
    },
    errorText: {
        color: '#B91C1C',
        textAlign: 'center',
        marginBottom: 15,
    },
    errorButton: {
        backgroundColor: '#F87171',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    errorButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
});


// --- Modal Styles (Updated with Audio Button Styles) ---

const insightModalStyles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F0FFF4', // Very light green background
    },
    container: {
        flexGrow: 1,
        padding: 20,
        paddingBottom: 40,
    },
    header: {
        marginBottom: 20,
        paddingBottom: 10,
        borderBottomWidth: 2,
        borderBottomColor: '#A7F3D0',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#047857',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 4,
    },
    // NEW: Audio button styles
    audioButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3B82F6', // Blue for audio
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 8,
        marginTop: 15,
        shadowColor: '#1D4ED8',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    audioButtonActive: {
        backgroundColor: '#DC2626', // Red when active (speaking)
    },
    audioButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 8,
    },
    // End new styles
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginTop: 10,
        marginBottom: 10,
        paddingBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#D1FAE5',
    },
    metricRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 10,
        marginBottom: 15,
        borderLeftWidth: 4,
        borderLeftColor: '#34D399',
    },
    insightMetricContainer: {
        alignItems: 'center',
        flex: 1,
        paddingHorizontal: 4,
    },
    insightMetricIcon: {
        marginBottom: 4,
    },
    insightMetricValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
    },
    insightMetricLabel: {
        fontSize: 10,
        color: '#6B7280',
        textAlign: 'center',
    },
    highlightText: {
        color: '#EF4444', // Red for caution
    },
    adviceBlock: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 15,
        borderWidth: 1,
        borderColor: '#D1FAE5',
        marginBottom: 15,
    },
    adviceItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 10,
        paddingHorizontal: 5,
    },
    adviceText: {
        flexShrink: 1,
        fontSize: 14,
        color: '#374151',
        lineHeight: 20,
    },
    closeButton: {
        paddingVertical: 12,
        backgroundColor: '#4CAF50',
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    closeButtonText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 16,
        marginLeft: 8,
    }
});