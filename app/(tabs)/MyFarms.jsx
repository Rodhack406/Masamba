import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { DiseaseDetailsComponent } from "../../components/scan.jsx/diseaseInfo";
import { DISEASE_INFO } from "../../components/scan.jsx/diseaseInfoData";

// --- Configuration ---
// Set your server IP/address here.
const SERVER_URL = "http://10.132.113.102:5000/predict"; 


export default function PlantDiseaseDetector() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  // This state will hold the final, rich result object for display in the sub-component
  const [result, setResult] = useState(null); 
  const [sound, setSound] = useState(); // Retained for general audio management

  // Function to handle clean up of general audio (if any)
  async function unloadAudio() {
    if (sound) {
      await sound.unloadAsync();
    }
    setSound(null);
  }

  // --- IMAGE PICKER/CAPTURE FUNCTIONS (Simplified) ---
  const captureImage = async () => {
    await unloadAudio();
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    if (!cameraPermission.granted) {
      Alert.alert("Permission Required", "Camera access is needed to take a picture.");
      return;
    }

    const res = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });

    if (!res.canceled) {
      setImage(res.assets[0]);
      setResult(null); 
    }
  };

  const pickImage = async () => {
    await unloadAudio();
    const libraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!libraryPermission.granted) {
      Alert.alert("Permission Required", "Gallery access is needed to select an image.");
      return;
    }

    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!res.canceled) {
      setImage(res.assets[0]);
      setResult(null);
    }
  };

  // --- UPLOAD FUNCTION ---
  const uploadImage = async () => {
    if (!image) return Alert.alert("Selection Error", "Please select or capture an image first.");

    await unloadAudio();
    setLoading(true); 
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", {
        uri: image.uri,
        name: "plant_leaf.jpg",
        type: "image/jpeg",
      });

      const response = await fetch(SERVER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      const predictedLabel = data["Predicted Label"];

      if (predictedLabel && DISEASE_INFO[predictedLabel]) {
         const info = DISEASE_INFO[predictedLabel];
         // Set the rich result object for the details component
         setResult({
            classId: data["Class ID"],
            label: predictedLabel,
            name: info.name,
            description: info.description,
            measures: info.measures,
         });
      } else {
        throw new Error(`Prediction received, but information for label "${predictedLabel}" is missing.`);
      }
      
    } catch (e) {
      console.error("Upload error:", e);
      Alert.alert("Analysis Failed", `Error: ${e.message}. Ensure server is running on ${SERVER_URL}`);
      setResult(null);
    }

    setLoading(false); 
  };
  
  // --- RENDER ---
  return (
    <ScrollView style={{flex: 1}} contentContainerStyle={styles.container}>
      <Text style={styles.title}>🌱 Plant Disease Detector</Text>

      {/* Image Selection Buttons */}
      <View style={styles.buttonGroup}>
        <TouchableOpacity style={[styles.button, styles.cameraButton]} onPress={captureImage}>
          <Text style={styles.buttonText}>Capture Image</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>Select from Gallery</Text>
        </TouchableOpacity>
      </View>

      {image && (
        <>
          {/* Image Preview */}
          <Image
            source={{ uri: image.uri }}
            style={styles.preview}
            resizeMode="contain"
          />
          
          {/* Analyze Button */}
          <TouchableOpacity 
            style={[styles.button, styles.analyzeButton, loading && styles.disabledButton]} 
            onPress={uploadImage}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Analyze Image</Text>
            )}
          </TouchableOpacity>
        </>
      )}

      {/* The dedicated component displays the detailed result */}
      {result && <DiseaseDetailsComponent result={result} />}

    </ScrollView>
  );
}


// --- STYLESHEET (Only for the main layout/buttons) ---
const styles = StyleSheet.create({
    container: {
        padding: 25,
        alignItems: "center",
        backgroundColor: "#f7f7f7",
        paddingBottom: 50,
    },
    title: {
        fontSize: 24,
        marginVertical: 20,
        fontWeight: "bold",
        color: "#38761d",
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 10,
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 8,
        marginHorizontal: 5,
        backgroundColor: "#28a745",
    },
    cameraButton: {
        backgroundColor: "#007bff",
    },
    analyzeButton: {
        backgroundColor: "#dc3545",
        width: '80%',
        marginTop: 15,
        marginBottom: 10,
    },
    disabledButton: {
        backgroundColor: "#6c757d",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    preview: {
        width: "100%",
        height: 300,
        marginVertical: 20,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#ddd',
    },
});