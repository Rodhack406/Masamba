import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// You will need to install 'expo-speech' for the TTS feature
import * as Speech from 'expo-speech';

// This component expects the full result object as a prop:
// { classId, label, name, description, measures }
export function DiseaseDetailsComponent({ result }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [sound, setSound] = useState(null); // Retaining for cleanup logic
  
  // -----------------------------------------------------
  // NEW: Extract the crop name from the original label string
  // Assumes label format is "CropName___DiseaseName"
  // -----------------------------------------------------
  const cropName = result ? result.label.split('___')[0].replace(/_/g, ' ') : "Unknown Crop";

  // Function to stop any currently playing speech
  const stopSpeech = async () => {
    // Check if TTS is currently speaking and stop it
    const speakingStatus = await Speech.isSpeakingAsync();
    if (speakingStatus) {
      Speech.stop();
    }
    setIsSpeaking(false);
  };
  
  // Function to handle the Text-to-Speech (TTS)
  const toggleAudio = async () => {
    if (!result) return;

    if (isSpeaking) {
      // If currently speaking, stop it
      await stopSpeech();
    } else {
      // MODIFIED: Include the crop name in the spoken text
      const fullText = `Prediction for ${cropName}. Predicted disease is ${result.name}. Description: ${result.description}. Management measures: ${result.measures.join('. ')}.`;
      
      try {
        setIsSpeaking(true);
        
        await Speech.speak(fullText, { 
          language: 'en-US',
          onDone: () => setIsSpeaking(false), // Turn off speaking state when done
          onError: (e) => {
            console.error("Speech Error:", e);
            Alert.alert("Audio Error", "Could not read the information.");
            setIsSpeaking(false);
          }
        });
      } catch (error) {
        console.error("TTS Initialization Error:", error);
        Alert.alert("Setup Error", "Text-to-Speech failed. Ensure 'expo-speech' is installed.");
        setIsSpeaking(false);
      }
    }
  };

  // Cleanup: Stop speech when the component is unmounted or result changes
  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, [result]);

  if (!result) {
    return <Text>No disease information available.</Text>;
  }

  return (
    <View style={styles.resultBox}>
      {/* NEW: Display the Crop Name prominently */}
      <Text style={styles.cropTitle}>🌿 Crop: {cropName}</Text>

      {/* HEADER: Disease Name and Audio Button */}
      <View style={styles.resultHeader}>
        <Text style={styles.resultTitle}>Disease: {result.name}</Text>
        
        <TouchableOpacity 
          style={[styles.audioButton, isSpeaking && styles.audioButtonActive]} 
          onPress={toggleAudio}
        >
          <Text style={styles.audioButtonText}>
            {isSpeaking ? '🛑 Stop Reading' : '🔊 Read Aloud'}
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* DESCRIPTION */}
      <Text style={styles.sectionTitle}>Description:</Text>
      <Text style={styles.bodyText}>{result.description}</Text>

      {/* MANAGEMENT MEASURES */}
      <Text style={styles.sectionTitle}>Management Measures:</Text>
      {result.measures.map((measure, index) => (
        <Text key={index} style={styles.listItem}>
          • {measure}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  resultBox: {
    marginTop: 20,
    padding: 18,
    backgroundColor: "#e6ffe6", // Light green background
    width: "100%",
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#38761d', // Dark green border
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  // NEW: Style for the prominent Crop Name title
  cropTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#38761d', 
    marginBottom: 10,
    textAlign: 'center',
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#cfe2f3',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#38761d',
    flexShrink: 1,
    paddingRight: 10,
  },
  audioButton: {
    backgroundColor: '#ffc107', // Yellow/Orange
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  audioButtonActive: {
    backgroundColor: '#dc3545', // Red when speaking
  },
  audioButtonText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    color: '#333',
  },
  bodyText: {
    fontSize: 15,
    marginBottom: 10,
    color: '#555',
    lineHeight: 22,
  },
  listItem: {
    fontSize: 15,
    marginLeft: 5,
    marginBottom: 5,
    paddingLeft: 5,
    color: '#555',
  }
});