/**
 * Compatibility fixes for Three.js
 * 
 * Since r152, Three.js deprecated or removed various constants
 * This file provides compatibility constants for older code
 */
import * as THREE from 'three';

// Create compatibility constants for Three.js
export const ThreeCompat = {
  // Encoding constants that have been removed in newer Three.js
  LinearEncoding: 3000,
  sRGBEncoding: 3001,
  
  // Shadow map constants
  BasicShadowMap: 0,
  PCFShadowMap: 1,
  PCFSoftShadowMap: 2
};

// For modules that directly import from three
// This needs to be handled in their specific files
// by replacing imports like:
// import { LinearEncoding } from 'three'
// with:
// import { ThreeCompat } from '@/utils/compatibility-fix'
// const { LinearEncoding } = ThreeCompat; 