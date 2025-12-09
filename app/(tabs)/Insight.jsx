import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import WeatherFarmInsight from "../../components/Insight/WeatherFarmInsight";
import BiocharBusinessModule from "../../components/Insight/ad";

export default function Insight() {
  return (
    <SafeAreaView style={{}}>
        {/* The ScrollView now only wraps the content below the header */}
        <ScrollView>
            <WeatherFarmInsight />
            <BiocharBusinessModule />
        </ScrollView>
    </SafeAreaView>
  );
}
