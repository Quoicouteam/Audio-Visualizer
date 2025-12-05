import * as THREE from 'three';
import { getShader2D, getAvailableShaders2D, getShader2DParams } from './shaderManager.js';

let mesh;
let customTexture = null;
let currentShaderName = 'laser';

// Exporter la liste des shaders disponibles
export { getAvailableShaders2D };

// Fonction pour obtenir le nom du shader actuel
export const getCurrentShaderName = () => currentShaderName;

// Fonction pour obtenir les paramètres du shader actuel
export const getCurrentShader2DParams = () => {
    return getShader2DParams(currentShaderName);
};

// Fonction pour mettre à jour un paramètre de shader
export const updateShaderParam = (paramName, value) => {
    if (!mesh || !mesh.material || !mesh.material.uniforms) return;

    if (mesh.material.uniforms[paramName]) {
        mesh.material.uniforms[paramName].value = value;
    }
};

export const generate2DVisualizer = (scene, camera) => {
    console.log('[generate2DVisualizer] Génération du visualizer 2D, customTexture:', !!customTexture);

    const distance = camera.position.z;
    const vFov = camera.fov * Math.PI / 180;
    const planeHeight = 2 * Math.tan(vFov / 2) * distance;
    const planeWidth = planeHeight * camera.aspect;

    const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);

    const shader = getShader2D(currentShaderName);

    const uniforms = {};
    for (const key in shader.uniforms) {
        uniforms[key] = { value: shader.uniforms[key].value };
    }

    if (customTexture) {
        if (uniforms.uTexture) uniforms.uTexture.value = customTexture;
        if (uniforms.u_texture) uniforms.u_texture.value = customTexture;
        if (uniforms.uHasTexture) uniforms.uHasTexture.value = true;
    }

    if (uniforms.u_resolution) {
        uniforms.u_resolution.value = [window.innerWidth, window.innerHeight];
    }

    const material = new THREE.ShaderMaterial({
        vertexShader: shader.vertex,
        fragmentShader: shader.fragment,
        uniforms: uniforms,
        transparent: true
    });

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    return mesh;
};

export const update2DVisualizer = (audioData, time) => {
    if (!mesh || !mesh.material || !mesh.material.uniforms) return;

    const uniforms = mesh.material.uniforms;

    if (uniforms.uTime) uniforms.uTime.value = time;
    if (uniforms.u_time) uniforms.u_time.value = time;

    if (uniforms.uAudioData) uniforms.uAudioData.value = audioData.overall;
    if (uniforms.u_audioLevel) uniforms.u_audioLevel.value = audioData.overall;

    if (uniforms.u_bass) uniforms.u_bass.value = audioData.bass;
    if (uniforms.u_mid) uniforms.u_mid.value = audioData.mid;
    if (uniforms.u_treble) uniforms.u_treble.value = audioData.treble;

    if (uniforms.u_peak) uniforms.u_peak.value = audioData.peak;
    if (uniforms.u_energy) uniforms.u_energy.value = audioData.energy;

    if (uniforms.u_resolution) uniforms.u_resolution.value = [window.innerWidth, window.innerHeight];
};

export const cleanup2DVisualizer = (scene) => {
    if (mesh) {
        scene.remove(mesh);
        mesh.geometry.dispose();
        mesh.material.dispose();
        mesh = null;
    }
};

export const resetToDefaultImage = () => {
    console.log('[resetToDefaultImage] Réinitialisation de l\'image');
    customTexture = null;
    currentShaderName = 'laser';
};

export const resize2DVisualizer = (camera) => {
    if (!mesh || !camera) return;

    // Recalculer les dimensions pour remplir l'écran
    const distance = camera.position.z;
    const vFov = camera.fov * Math.PI / 180;
    const planeHeight = 2 * Math.tan(vFov / 2) * distance;
    const planeWidth = planeHeight * camera.aspect;

    // Mettre à jour la géométrie
    mesh.geometry.dispose();
    mesh.geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
};

export const setShader2D = (shaderName, scene) => {
    if (!mesh || !scene) return;

    const shader = getShader2D(shaderName);

    // Créer les nouveaux uniforms
    const uniforms = {};
    for (const key in shader.uniforms) {
        uniforms[key] = { value: shader.uniforms[key].value };
    }

    // Préserver les valeurs actuelles si les uniforms existent
    if (mesh.material.uniforms.uTime && uniforms.uTime) {
        uniforms.uTime.value = mesh.material.uniforms.uTime.value;
    }
    if (mesh.material.uniforms.uAudioData && uniforms.uAudioData) {
        uniforms.uAudioData.value = mesh.material.uniforms.uAudioData.value;
    }
    if (mesh.material.uniforms.u_time && uniforms.u_time) {
        uniforms.u_time.value = mesh.material.uniforms.u_time.value;
    }
    if (mesh.material.uniforms.u_audioLevel && uniforms.u_audioLevel) {
        uniforms.u_audioLevel.value = mesh.material.uniforms.u_audioLevel.value;
    }

    // Si on a une texture et que le shader le supporte
    if (customTexture) {
        if (uniforms.uTexture) uniforms.uTexture.value = customTexture;
        if (uniforms.uHasTexture) uniforms.uHasTexture.value = true;
    }

    // Pour le shader pixelSort, assigner la texture et la résolution
    if (shaderName === 'pixelSort') {
        if (customTexture && uniforms.u_texture) {
            uniforms.u_texture.value = customTexture;
        }
        if (uniforms.u_resolution) {
            uniforms.u_resolution.value = [window.innerWidth, window.innerHeight];
        }
    }

    // Créer le nouveau matériau
    const newMaterial = new THREE.ShaderMaterial({
        vertexShader: shader.vertex,
        fragmentShader: shader.fragment,
        uniforms: uniforms,
        transparent: true
    });

    // Remplacer le matériau
    mesh.material.dispose();
    mesh.material = newMaterial;
    currentShaderName = shaderName;
};

export const setImageTexture = (imageUrl, scene) => {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(imageUrl, (texture) => {
        customTexture = texture;
        customTexture.minFilter = THREE.LinearFilter;
        customTexture.magFilter = THREE.LinearFilter;

        // Obtenir les dimensions originales de l'image
        const imageWidth = texture.image.width;
        const imageHeight = texture.image.height;
        const aspectRatio = imageWidth / imageHeight;

        // Calculer les dimensions pour que l'image soit bien visible
        let planeWidth, planeHeight;
        const maxSize = 4; // Taille maximale pour rester visible dans la scène

        if (aspectRatio > 1) {
            // Image horizontale
            planeWidth = maxSize;
            planeHeight = maxSize / aspectRatio;
        } else {
            // Image verticale
            planeHeight = maxSize;
            planeWidth = maxSize * aspectRatio;
        }

        // Si le mesh existe déjà, le supprimer et en créer un nouveau avec les bonnes dimensions
        if (mesh && scene) {
            scene.remove(mesh);
            mesh.geometry.dispose();
            mesh.material.dispose();

            // Créer nouvelle géométrie avec les dimensions de l'image
            const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);

            // Utiliser le shader texture
            const shader = getShader2D('texture');
            const uniforms = {};
            for (const key in shader.uniforms) {
                uniforms[key] = { value: shader.uniforms[key].value };
            }
            uniforms.uTexture.value = customTexture;

            const newMaterial = new THREE.ShaderMaterial({
                vertexShader: shader.vertex,
                fragmentShader: shader.fragment,
                uniforms: uniforms
            });

            mesh = new THREE.Mesh(geometry, newMaterial);
            scene.add(mesh);
            currentShaderName = 'texture';
        }
    });
};
