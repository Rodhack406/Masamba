// DiseaseInfoData.js

export const DISEASE_INFO = {
  // --- Corn Diseases ---
  "Corn___Common_Rust": {
    name: "Common Rust (Puccinia sorghi)",
    description: "Common rust appears as small, cinnamon-brown, raised pustules (uredia) on both surfaces of the leaf. As the plant matures, these turn dark brown/black (telia). Severe infections can lead to premature leaf death and reduced yield.",
    measures: [
      "Plant resistant hybrids (the best control method).",
      "Apply foliar fungicides (strobilurins or triazoles) when rust severity reaches 5-10% of the leaf area, especially before tasseling.",
      "Manage volunteer corn and perennial grass hosts.",
    ],
  },
  "Corn___Gray_Leaf_Spot": {
    name: "Gray Leaf Spot (Cercospora zeae-maydis)",
    description: "Gray leaf spot forms characteristic long, rectangular, pale brown to gray lesions that are limited by the leaf veins. It typically starts in the lower canopy and moves up. It thrives in high humidity and warm weather.",
    measures: [
      "Select resistant or tolerant hybrids.",
      "Practice crop rotation (e.g., with soybeans or small grains) to reduce inoculum in the soil.",
      "Utilize tillage where appropriate to bury infected residue.",
      "Apply fungicides (often necessary if the disease appears early and conditions favor its spread).",
    ],
  },
  "Corn___Healthy": {
    name: "Healthy",
    description: "The corn leaf appears free of major disease symptoms. Maintain good agricultural practices, including balanced fertilization and irrigation, to ensure continued health.",
    measures: ["Continue monitoring for early signs of disease.", "Ensure optimal nutrient and water management."],
  },

  // --- Potato Diseases ---
  "Potato___Early_Blight": {
    name: "Early Blight (Alternaria solani)",
    description: "Early blight causes dark brown to black spots, often with concentric rings (target spot appearance) on older, lower leaves. Severe infections lead to defoliation and reduced tuber size/yield.",
    measures: [
      "Apply fungicides preventively or as soon as symptoms appear (Mancozeb, Chlorothalonil).",
      "Use resistant or tolerant potato varieties.",
      "Ensure proper hilling to cover developing tubers and avoid tuber infection.",
      "Avoid excess overhead irrigation late in the day.",
    ],
  },
  "Potato___Late_Blight": {
    name: "Late Blight (Phytophthora infestans)",
    description: "Late blight is a highly destructive disease causing dark, water-soaked lesions on leaves and stems, often with a white moldy growth on the undersides in humid conditions. It can spread rapidly and rot tubers in storage.",
    measures: [
      "Destroy all volunteer potato plants and nightshade weeds.",
      "Apply systemic fungicides (e.g., Ridomil) and protective fungicides (e.g., Chlorothalonil) on a strict schedule.",
      "Avoid irrigation late in the day or during cool, wet periods.",
      "Ensure deep hilling to protect tubers.",
    ],
  },
  "Potato___Healthy": {
    name: "Healthy",
    description: "The potato leaf appears healthy and vigorous. Continue proper watering, fertilization, and pest management to maintain crop vitality.",
    measures: ["Monitor soil moisture and nutrient levels.", "Regularly scout fields for early signs of new diseases or pests."],
  },

  // --- Rice Diseases ---
  "Rice___Brown_Spot": {
    name: "Brown Spot (Bipolaris oryzae)",
    description: "Brown spot causes numerous elliptical to circular spots on leaves, grain, and sheaths. Spots have a brown margin and a gray or tan center. It is often linked to soil nutrient deficiency (especially Potassium).",
    measures: [
      "Improve soil fertility, particularly by ensuring adequate potassium (K) levels.",
      "Use seed treatments with appropriate fungicides.",
      "Apply foliar fungicides if the disease pressure is high during the heading stage.",
    ],
  },
  "Rice___Leaf_Blast": {
    name: "Leaf Blast (Magnaporthe oryzae)",
    description: "Blast lesions on leaves are typically diamond-shaped with gray centers and dark green/brown borders. Severe infection can kill seedlings (blast), or cause neck/panicle blast, leading to empty or partially filled grains.",
    measures: [
      "Plant resistant rice varieties.",
      "Use fungicide seed treatment and foliar sprays (Tricyclazole, Azoxystrobin) at the booting and heading stages.",
      "Avoid excessive nitrogen fertilization, which makes the plant more susceptible.",
    ],
  },
  "Rice___Healthy": {
    name: "Healthy",
    description: "The rice plant shows no signs of major diseases. Maintain flooded conditions (if applicable) and follow recommended fertilization schedules.",
    measures: ["Maintain proper water management.", "Monitor nutrient levels, especially nitrogen and potassium."],
  },
  
  // --- Wheat Diseases ---
  "Wheat___Brown_Rust": {
    name: "Brown Rust / Leaf Rust (Puccinia triticina)",
    description: "Leaf rust appears as small, reddish-brown pustules, typically on the upper surface of the leaves. It reduces the photosynthetic area, leading to shriveled grains and reduced yield.",
    measures: [
      "Plant resistant wheat cultivars.",
      "Apply fungicides (Triazole or Strobilurin) at flag leaf emergence if disease pressure is high.",
      "Control volunteer wheat plants in the off-season.",
    ],
  },
  "Wheat___Yellow_Rust": {
    name: "Yellow Rust / Stripe Rust (Puccinia striiformis)",
    description: "Yellow rust forms characteristic yellow to orange-yellow pustules arranged in stripes or streaks on the leaves. It thrives in cool, humid conditions and can cause significant yield loss if not managed.",
    measures: [
      "Use resistant wheat cultivars.",
      "Apply effective fungicides early in the season when the disease is first observed and conditions are cool and wet.",
      "Avoid excessive planting density.",
    ],
  },
  "Wheat___Healthy": {
    name: "Healthy",
    description: "The wheat plant is healthy. Ensure adequate moisture during critical growth stages (tillering, booting, heading) for optimal grain fill.",
    measures: ["Ensure proper weed control.", "Monitor for nutrient deficiencies or pest damage."],
  },

  // --- Invalid/Other ---
  "Invalid": {
    name: "Unrecognized or Invalid Sample",
    description: "The image could not be classified as a valid crop or common disease. Please ensure the image clearly shows the leaf of one of the supported crops (Corn, Potato, Rice, Wheat).",
    measures: ["Try capturing a clearer image.", "Ensure the image is focused on a leaf."],
  },
};
