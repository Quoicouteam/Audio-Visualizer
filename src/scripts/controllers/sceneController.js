/**
 * Scene Controller
 * Gère la création et la configuration de la scène Three.js
 */

import * as THREE from 'three';

let scene = null;

/**
 * Crée une nouvelle scène
 * @returns {THREE.Scene}
 */
export const createScene = () => {
    scene = new THREE.Scene();
    return scene;
};

/**
 * Obtient la scène actuelle
 * @returns {THREE.Scene|null}
 */
export const getScene = () => {
    return scene;
};

/**
 * Nettoie la scène
 */
export const clearScene = () => {
    if (!scene) return;

    // Supprimer tous les objets
    while (scene.children.length > 0) {
        const object = scene.children[0];
        scene.remove(object);

        // Nettoyer les géométries et matériaux
        if (object.geometry) {
            object.geometry.dispose();
        }
        if (object.material) {
            if (Array.isArray(object.material)) {
                object.material.forEach(mat => mat.dispose());
            } else {
                object.material.dispose();
            }
        }
    }
};
