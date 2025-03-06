import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converts a file to a data URL
 */
export function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Creates a URL for a Blob or File
 */
export function createObjectURL(file: File | Blob): string {
  return URL.createObjectURL(file);
}

/**
 * Revokes a previously created object URL to free up memory
 */
export function revokeObjectURL(url: string): void {
  URL.revokeObjectURL(url);
}

/**
 * Formats a confidence value to a percentage
 */
export function formatConfidence(confidence: number): string {
  return `${Math.round(confidence * 100)}%`;
}

/**
 * Format a hazard type to a more readable form
 */
export function formatHazardType(type: string): string {
  const mapping: Record<string, string> = {
    'pothole': 'Pothole',
    'waterlogging': 'Water Logging',
    'other': 'Other Hazard',
    'unknown': 'Unknown Hazard'
  };
  
  return mapping[type] || type.charAt(0).toUpperCase() + type.slice(1);
}
