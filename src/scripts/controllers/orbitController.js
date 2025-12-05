/**
 * Orbit Controller
 * Gère les contrôles OrbitControls
 */

import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib';

let controls = null;

/**
 * Crée les contrôles orbit
 * @param {THREE.Camera} camera - Caméra à contrôler
 * @param {HTMLElement} domElement - Élément DOM pour les événements
 * @param {Object} options - Options de configuration
 * @returns {OrbitControls}
 */
export const createOrbitControls = (camera, domElement, options = {}) => {
    const {
        enableRotate = true,
        enablePan = true,
        enableZoom = true,
        zoomSpeed = 1.0,
        minDistance = 0.5,
        maxDistance = 50,
        enableDamping = false,
        autoRotate = false,
        screenSpacePanning = true
    } = options;

    controls = new OrbitControls(camera, domElement);

    controls.enableRotate = enableRotate;
    controls.enablePan = enablePan;
    controls.enableZoom = enableZoom;
    controls.zoomSpeed = zoomSpeed;
    controls.minDistance = minDistance;
    controls.maxDistance = maxDistance;
    controls.enableDamping = enableDamping;
    controls.autoRotate = autoRotate;
    controls.screenSpacePanning = screenSpacePanning;

    controls.mouseButtons = {
        LEFT: THREE.MOUSE.ROTATE,
        RIGHT: THREE.MOUSE.PAN
    };

    return controls;
};

/**
 * Obtient les contrôles actuels
 * @returns {OrbitControls|null}
 */
export const getOrbitControls = () => {
    return controls;
};

/**
 * Met à jour les contrôles
 */
export const updateOrbitControls = () => {
    if (controls) {
        controls.update();
    }
};

/**
 * Réinitialise les contrôles à leur état initial
 */
export const resetOrbitControls = () => {
    if (controls) {
        controls.reset();
    }
};

/**
 * Active ou désactive les contrôles
 * @param {boolean} enabled - État d'activation
 */
export const setOrbitControlsEnabled = (enabled) => {
    if (controls) {
        controls.enabled = enabled;
    }
};

/**
 * Nettoie les contrôles
 */
export const disposeOrbitControls = () => {
    if (controls) {
        controls.dispose();
        controls = null;
    }
};
