/**
 * Mode Controller
 * Gère les modes de visualisation (2D/3D)
 */

import {
    generate2DVisualizer,
    cleanup2DVisualizer,
    resetToDefaultImage
} from '../2DVisualizer.js';

import {
    generate3DVisualizer,
    cleanup3DVisualizer,
    resetToDefaultModel
} from '../3DVisualizer.js';

import { getCamera } from './cameraController.js';
import { getOrbitControls } from './orbitController.js';

let currentMode = '3d-model';

/**
 * Obtient le mode actuel
 * @returns {string}
 */
export const getCurrentMode = () => {
    return currentMode;
};

/**
 * Nettoie le mode actuel
 * @param {THREE.Scene} scene - Scène à nettoyer
 */
export const cleanupCurrentMode = (scene) => {
    if (currentMode === '3d-model') {
        cleanup3DVisualizer(scene);
    } else if (currentMode === '2d') {
        cleanup2DVisualizer(scene);
    }
};

/**
 * Change le mode de visualisation
 * @param {string} mode - Nouveau mode ('2d' ou '3d-model')
 * @param {THREE.Scene} scene - Scène Three.js
 */
export const switchToMode = (mode, scene) => {
    if (!scene) {
        console.error('Scene non définie');
        return;
    }

    // Nettoyer l'ancien mode
    cleanupCurrentMode(scene);

    // Changer le mode
    currentMode = mode;

    // Gérer les contrôles orbit selon le mode
    const controls = getOrbitControls();
    if (controls) {
        if (mode === '2d') {
            // Désactiver tous les contrôles en mode 2D
            controls.enabled = false;
        } else {
            // Réactiver les contrôles en mode 3D
            controls.enabled = true;
        }
    }

    // Initialiser le nouveau mode
    const camera = getCamera();
    if (mode === '3d-model') {
        generate3DVisualizer(scene);
    } else if (mode === '2d') {
        generate2DVisualizer(scene, camera);
    }
};

/**
 * Réinitialise le mode 3D aux valeurs par défaut
 * @param {THREE.Scene} scene - Scène Three.js
 */
export const resetMode3D = (scene) => {
    if (!scene) return;

    // Nettoyer l'ancien mode
    cleanupCurrentMode(scene);

    // Changer le mode
    currentMode = '3d-model';

    // Réactiver les contrôles orbit en mode 3D
    const controls = getOrbitControls();
    if (controls) {
        controls.enabled = true;
    }

    // Réinitialiser et générer
    resetToDefaultModel();
    generate3DVisualizer(scene);
};

/**
 * Réinitialise le mode 2D aux valeurs par défaut
 * @param {THREE.Scene} scene - Scène Three.js
 */
export const resetMode2D = (scene) => {
    if (!scene) return;

    // Nettoyer l'ancien mode
    cleanupCurrentMode(scene);

    // Changer le mode
    currentMode = '2d';

    // Désactiver les contrôles orbit
    const controls = getOrbitControls();
    if (controls) {
        controls.enabled = false;
    }

    // Réinitialiser et générer
    const camera = getCamera();
    resetToDefaultImage();
    generate2DVisualizer(scene, camera);
};

/**
 * Vérifie si le mode actuel est 2D
 * @returns {boolean}
 */
export const is2DMode = () => {
    return currentMode === '2d';
};

/**
 * Vérifie si le mode actuel est 3D
 * @returns {boolean}
 */
export const is3DMode = () => {
    return currentMode === '3d-model';
};
