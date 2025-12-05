/**
 * Scene Manager
 * Orchestre l'initialisation et la coordination des différents modules
 */

import { getAudioData } from './audioManager.js';
import { update2DVisualizer, setImageTexture, setShader2D, getCurrentShader2DParams, updateShaderParam as updateShader2DParam, resize2DVisualizer } from './2DVisualizer.js';
import { update3DVisualizer, loadCustomModel, setShader3D, cleanup3DVisualizer, generate3DVisualizer,
         getCurrentShaderName3D, getCurrentShader3DParams, setRotationSpeed, updateShaderParam } from './3DVisualizer.js';

// Controllers
import { startAnimation, pauseAnimation, resumeAnimation, stopAnimation } from './controllers/animationController.js';
import { createCamera, getCamera, updateCameraAspect } from './controllers/cameraController.js';
import { createRenderer, getRenderer, resizeRenderer, render } from './controllers/rendererController.js';
import { createOrbitControls, updateOrbitControls, resetOrbitControls, disposeOrbitControls } from './controllers/orbitController.js';
import { createScene, getScene } from './controllers/sceneController.js';
import { switchToMode, cleanupCurrentMode, getCurrentMode, resetMode3D, resetMode2D } from './controllers/modeController.js';

/**
 * Initialise la scène et tous les composants
 * @param {HTMLElement} container - Conteneur DOM
 */
export const initScene = (container) => {
    console.log('[initScene] Démarrage...');

    // Créer la scène
    const scene = createScene();
    console.log('[initScene] Scène créée:', scene);

    // Créer la caméra
    const camera = createCamera({
        fov: 75,
        position: { x: 0, y: 0, z: 5 }
    });
    console.log('[initScene] Caméra créée:', camera);

    // Créer le renderer
    const renderer = createRenderer(container);
    console.log('[initScene] Renderer créé:', renderer);

    // Créer les contrôles orbit
    const controls = createOrbitControls(camera, renderer.domElement, {
        enableRotate: true,
        enablePan: true,
        enableZoom: true,
        zoomSpeed: 1.0,
        minDistance: 0.5,
        maxDistance: 50
    });
    console.log('[initScene] OrbitControls créés:', controls);

    // Initialiser en mode 3D
    console.log('[initScene] Initialisation en mode 3D...');
    switchToMode('3d-model', scene);

    // Démarrer l'animation
    console.log('[initScene] Démarrage de l\'animation...');
    startAnimation(() => {
        animationLoop();
    });

    console.log('[initScene] Initialisation terminée');
};

/**
 * Boucle d'animation principale
 */
const animationLoop = () => {
    const scene = getScene();
    const camera = getCamera();
    const renderer = getRenderer();

    if (!scene || !camera || !renderer) {
        console.warn('[animationLoop] Manquant:', { scene: !!scene, camera: !!camera, renderer: !!renderer });
        return;
    }

    const audioData = getAudioData();
    const time = performance.now() / 1000;
    const currentMode = getCurrentMode();

    // Mettre à jour le visualiseur selon le mode
    if (currentMode === '3d-model') {
        update3DVisualizer(audioData, time);
    } else if (currentMode === '2d') {
        update2DVisualizer(audioData, time);
    }

    // Mettre à jour les contrôles et rendre
    updateOrbitControls();
    render(scene, camera);
};

/**
 * Change le mode de visualisation (garde le modèle/image personnalisé)
 * @param {string} mode - Nouveau mode
 */
export const switchMode = (mode) => {
    const scene = getScene();
    if (!scene) return;

    resetOrbitControls();
    switchToMode(mode, scene);
};

/**
 * Change le mode et réinitialise aux valeurs par défaut
 * Utilisé par les boutons de mode pour revenir à la sphère/plan par défaut
 * @param {string} mode - Nouveau mode
 */
export const switchModeAndReset = (mode) => {
    const scene = getScene();
    if (!scene) {
        console.error('[switchModeAndReset] Scene non définie');
        return;
    }

    console.log('[switchModeAndReset] Changement vers mode:', mode);

    const wasAnimating = pauseAnimation();

    try {
        resetOrbitControls();

        if (mode === '3d-model') {
            console.log('[switchModeAndReset] Réinitialisation 3D...');
            resetMode3D(scene);
        } else if (mode === '2d') {
            console.log('[switchModeAndReset] Réinitialisation 2D...');
            resetMode2D(scene);
        }

        console.log('[switchModeAndReset] Mode changé avec succès');
    } catch (error) {
        console.error('[switchModeAndReset] Erreur:', error);
    } finally {
        resumeAnimation(wasAnimating);
    }
};

/**
 * Gère le redimensionnement de la fenêtre
 */
export const onWindowResize = () => {
    const camera = getCamera();
    updateCameraAspect(window.innerWidth, window.innerHeight);
    resizeRenderer(window.innerWidth, window.innerHeight);

    // Redimensionner le plan 2D si on est en mode 2D
    const currentMode = getCurrentMode();
    if (currentMode === '2d' && camera) {
        resize2DVisualizer(camera);
    }
};

/**
 * Nettoie toutes les ressources
 */
export const cleanupScene = () => {
    const scene = getScene();

    stopAnimation();

    if (scene) {
        cleanupCurrentMode(scene);
    }

    disposeOrbitControls();

    const renderer = getRenderer();
    if (renderer) {
        renderer.dispose();
    }
};

/**
 * Définit une image 2D
 * @param {string} imageUrl - URL de l'image
 */
export const setImage2D = (imageUrl) => {
    const scene = getScene();
    if (!scene) return;

    const wasAnimating = pauseAnimation();

    try {
        setImageTexture(imageUrl, scene);

        if (getCurrentMode() !== '2d') {
            switchMode('2d');
        }
    } finally {
        resumeAnimation(wasAnimating);
    }
};

/**
 * Définit un modèle 3D
 * @param {string} modelUrl - URL du modèle
 * @param {string} extension - Extension du fichier
 */
export const setModel3D = async (modelUrl, extension) => {
    const scene = getScene();
    if (!scene) return;

    const wasAnimating = pauseAnimation();

    try {
        console.log('[setModel3D] Chargement du modèle...');
        await loadCustomModel(modelUrl, extension);
        console.log('[setModel3D] Modèle chargé, passage en mode 3D');

        // Si on est déjà en mode 3D, juste regénérer
        if (getCurrentMode() === '3d-model') {
            console.log('[setModel3D] Déjà en mode 3D, nettoyage et régénération');
            cleanup3DVisualizer(scene);
            generate3DVisualizer(scene);
        } else {
            console.log('[setModel3D] Changement de mode vers 3D');
            switchMode('3d-model');
        }
    } catch (error) {
        console.error('Erreur lors du chargement du modèle 3D:', error);
        alert(`Erreur lors du chargement du modèle: ${error.message}`);
    } finally {
        resumeAnimation(wasAnimating);
    }
};

/**
 * Change le shader 2D
 * @param {string} shaderName - Nom du shader
 */
export const changeShader2D = (shaderName) => {
    const scene = getScene();
    if (scene) {
        setShader2D(shaderName, scene);
    }
};

/**
 * Change le shader 3D
 * @param {string} shaderName - Nom du shader
 */
export const changeShader3D = (shaderName) => {
    const scene = getScene();
    if (scene) {
        setShader3D(shaderName, scene);
    }
};

/**
 * Obtient le mode actuel
 * @returns {string}
 */
export const getMode = () => {
    return getCurrentMode();
};

/**
 * Obtient le nom du shader 3D actuel
 * @returns {string}
 */
export const getCurrent3DShader = () => {
    return getCurrentShaderName3D();
};

/**
 * Obtient les paramètres du shader 3D actuel
 * @returns {Object}
 */
export const getCurrent3DShaderParams = () => {
    return getCurrentShader3DParams();
};

/**
 * Obtient les paramètres du shader 2D actuel
 * @returns {Object}
 */
export const getCurrent2DShaderParams = () => {
    return getCurrentShader2DParams();
};

/**
 * Met à jour la vitesse de rotation 3D
 * @param {number} speed - Nouvelle vitesse
 */
export const updateRotationSpeed = (speed) => {
    setRotationSpeed(speed);
};

/**
 * Met à jour un paramètre de shader 3D
 * @param {string} paramName - Nom du paramètre
 * @param {any} value - Nouvelle valeur
 */
export const update3DShaderParam = (paramName, value) => {
    updateShaderParam(paramName, value);
};

/**
 * Met à jour un paramètre de shader 2D
 * @param {string} paramName - Nom du paramètre
 * @param {any} value - Nouvelle valeur
 */
export const update2DShaderParam = (paramName, value) => {
    updateShader2DParam(paramName, value);
};
