/**
 * Renderer Controller
 * Gère la création et la configuration du renderer WebGL
 */

import * as THREE from 'three';

let renderer = null;

/**
 * Crée un renderer WebGL
 * @param {HTMLElement} container - Conteneur DOM
 * @param {Object} options - Options de configuration
 * @returns {THREE.WebGLRenderer}
 */
export const createRenderer = (container, options = {}) => {
    const {
        antialias = true,
        alpha = true,
        pixelRatio = Math.min(window.devicePixelRatio, 2)
    } = options;

    try {
        // Essayer de créer le renderer avec WebGL2
        renderer = new THREE.WebGLRenderer({ antialias, alpha });
    } catch (error) {
        console.warn('WebGL2 échoué, tentative avec WebGL1:', error);
        try {
            // Fallback vers WebGL1
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (gl) {
                renderer = new THREE.WebGLRenderer({
                    canvas,
                    context: gl,
                    antialias,
                    alpha
                });
            } else {
                throw new Error('WebGL non supporté');
            }
        } catch (fallbackError) {
            console.error('Impossible de créer le renderer WebGL:', fallbackError);
            alert('Erreur : Votre navigateur ne supporte pas WebGL. Essayez Chrome ou vérifiez vos drivers graphiques.');
            throw fallbackError;
        }
    }

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(pixelRatio);

    // Style pour les contrôles tactiles
    renderer.domElement.style.touchAction = 'none';

    container.appendChild(renderer.domElement);

    return renderer;
};

/**
 * Obtient le renderer actuel
 * @returns {THREE.WebGLRenderer|null}
 */
export const getRenderer = () => {
    return renderer;
};

/**
 * Redimensionne le renderer
 * @param {number} width - Largeur
 * @param {number} height - Hauteur
 */
export const resizeRenderer = (width, height) => {
    if (!renderer) return;

    renderer.setSize(width, height);
};

/**
 * Rend la scène avec la caméra
 * @param {THREE.Scene} scene - Scène à rendre
 * @param {THREE.Camera} camera - Caméra à utiliser
 */
export const render = (scene, camera) => {
    if (!renderer || !scene || !camera) return;

    renderer.render(scene, camera);
};

/**
 * Nettoie le renderer
 */
export const disposeRenderer = () => {
    if (renderer) {
        renderer.dispose();
        renderer = null;
    }
};
