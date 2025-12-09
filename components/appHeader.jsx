import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const AppHeader = () => {
    const HEADER_COLOR = '#4CAF50'; 
    const insets = useSafeAreaInsets();

    return (
        <>
            <StatusBar 
                backgroundColor={HEADER_COLOR}
                barStyle="light-content"

            />

            <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top }]}>
                <View style={styles.headerContainer}>

                    {/* Logo */}
                    <Text style={styles.logoText}>Masamba</Text>

                    {/* Menu Button */}
                    <Icon name="menu" size={28} color="#fff" />
                </View>
            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: '#4CAF50',
    },
    headerContainer: {
        width: '100%',
        height: 50,
        backgroundColor: '#4CAF50',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 18,
        marginTop: -16,
    },
    logoText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        letterSpacing: 0.5,
    },
});

export default AppHeader;
