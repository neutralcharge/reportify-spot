/**
 * Service for detecting hazard types from images
 */

// API endpoint for hazard detection
const HAZARD_DETECTION_API = 'https://detect.roboflow.com/infer/workflows/urbanfix/custom-workflow';
const API_KEY = 'j3C8g5q9c8vXk1FyhV1s';

// Types for responses
export interface HazardDetectionResult {
  type: string;
  confidence: number;
  detectedObjects?: Array<{
    class: string;
    confidence: number;
  }>;
}

/**
 * Detects hazard type from an image URL
 */
export async function detectHazardFromUrl(imageUrl: string): Promise<HazardDetectionResult> {
  try {
    const response = await fetch(HAZARD_DETECTION_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        api_key: API_KEY,
        inputs: {
          "image": { "type": "url", "value": imageUrl }
        }
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const result = await response.json();
    
    // Process the API response to determine hazard type
    return processDetectionResult(result);
  } catch (error) {
    console.error("Error detecting hazard:", error);
    return { 
      type: "unknown", 
      confidence: 0,
      detectedObjects: []
    };
  }
}

/**
 * Detects hazard type from a file object
 */
export async function detectHazardFromFile(file: File): Promise<HazardDetectionResult> {
  try {
    // Convert the file to a data URL
    const imageDataUrl = await fileToDataUrl(file);
    
    // For the API, we need a publicly accessible URL
    // In a real app, you'd upload to a temporary storage and get a URL
    // For demo purposes, we'll simulate with a random detection result
    
    // Simulate API detection with random results
    return simulateDetection();
  } catch (error) {
    console.error("Error detecting hazard from file:", error);
    return { 
      type: "unknown", 
      confidence: 0 
    };
  }
}

/**
 * Converts a File object to a data URL
 */
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Processes the detection API result
 */
function processDetectionResult(apiResult: any): HazardDetectionResult {
  // Implement proper parsing based on the actual API response structure
  // This is a placeholder implementation
  
  try {
    // Check if the API returned any hazard classifications
    if (apiResult?.predictions?.object_detection?.predictions) {
      const detections = apiResult.predictions.object_detection.predictions;
      
      // Find the prediction with highest confidence
      const highestConfidencePrediction = detections.reduce(
        (highest: any, current: any) => 
          (current.confidence > highest.confidence) ? current : highest, 
        { confidence: 0 }
      );
      
      if (highestConfidencePrediction) {
        return {
          type: mapClassToHazardType(highestConfidencePrediction.class),
          confidence: highestConfidencePrediction.confidence,
          detectedObjects: detections.map((det: any) => ({
            class: det.class,
            confidence: det.confidence
          }))
        };
      }
    }
    
    // Fallback result if no clear prediction
    return { 
      type: "other", 
      confidence: 0.5,
      detectedObjects: []
    };
  } catch (error) {
    console.error("Error processing detection result:", error);
    return { 
      type: "unknown", 
      confidence: 0,
      detectedObjects: [] 
    };
  }
}

/**
 * Maps detection class to hazard type
 */
function mapClassToHazardType(className: string): string {
  const classMap: Record<string, string> = {
    'pothole': 'pothole',
    'water_logging': 'waterlogging',
    'waterlogging': 'waterlogging',
    'garbage': 'other',
    'damaged_road': 'other',
    'blocked_drain': 'other'
    // Add more mappings as needed
  };
  
  return classMap[className.toLowerCase()] || 'other';
}

/**
 * Simulates a detection result (for demo purposes)
 */
function simulateDetection(): HazardDetectionResult {
  const hazardTypes = ['pothole', 'waterlogging', 'other'];
  const randomIndex = Math.floor(Math.random() * hazardTypes.length);
  const confidence = 0.6 + (Math.random() * 0.4); // Random confidence between 0.6 and 1.0
  
  return {
    type: hazardTypes[randomIndex],
    confidence: confidence,
    detectedObjects: [
      { class: hazardTypes[randomIndex], confidence: confidence }
    ]
  };
}
