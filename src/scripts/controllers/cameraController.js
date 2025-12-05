/**
 * Camera Controller
 * Gère la création et la configuration de la caméra
 */

import * as THREE from 'three';

let camera = null;

/**
 * Crée une caméra perspective
 * @param {Object} options - Options de configuration
 * @returns {THREE.PerspectiveCamera}
 */
export const createCamera = (options = {}) => {
    const {
        fov = 75,
        aspect = window.innerWidth / window.innerHeight,
        near = 0.1,
        far = 1000,
        position = { x: 0, y: 0, z: 5 }
    } = options;

    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(position.x, position.y, position.z);

    return camera;
};

/**
 * Obtient la caméra actuelle
 * @returns {THREE.PerspectiveCamera|null}
 */
export const getCamera = () => {
    return camera;
};

/**
 * Met à jour l'aspect ratio de la caméra
 * @param {number} width - Largeur
 * @param {number} height - Hauteur
 */
export const updateCameraAspect = (width, height) => {
    if (!camera) return;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
};

/**
 * Réinitialise la position de la caméra
 * @param {Object} position - Nouvelle position {x, y, z}
 */
export const resetCameraPosition = (position = { x: 0, y: 0, z: 5 }) => {
    if (!camera) return;

    camera.position.set(position.x, position.y, position.z);
    camera.lookAt(0, 0, 0);
};
