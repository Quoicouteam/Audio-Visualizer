import * as THREE from 'three';
import { OBJLoader } from 'three-stdlib';
import { FBXLoader } from 'three-stdlib';
import { GLTFLoader } from 'three-stdlib';
import { config } from './config.js';
import { getShader3D, getAvailableShaders3D, getShader3DParams } from './shaderManager.js';

let mesh;
let customModel = null;
let currentShaderName = 'spiky';
let rotationSpeedMultiplier = 1.0;

// Exporter la liste des shaders disponibles
export { getAvailableShaders3D };

// Fonction pour obtenir le nom du shader actuel
export const getCurrentShaderName3D = () => currentShaderName;

// Fonction pour obtenir les paramètres du shader actuel
export const getCurrentShader3DParams = () => {
    return getShader3DParams(currentShaderName);
};

// Fonction pour mettre à jour la vitesse de rotation
export const setRotationSpeed = (speed) => {
    rotationSpeedMultiplier = speed / config.rotationSpeed;
};

// Fonction pour mettre à jour un paramètre de shader
export const updateShaderParam = (paramName, value) => {
    if (!mesh) return;

    // Pour les modèles personnalisés, mettre à jour tous les mesh enfants
    if (customModel && mesh.children && mesh.children.length > 0) {
        mesh.traverse((child) => {
            if (child.isMesh && child.material && child.material.uniforms) {
                if (child.material.uniforms[paramName]) {
                    child.material.uniforms[paramName].value = value;
                }
            }
        });
    } else {
        // Modèle simple
        if (mesh.material && mesh.material.uniforms && mesh.material.uniforms[paramName]) {
            mesh.material.uniforms[paramName].value = value;
        }
    }
};

export const generate3DVisualizer = (scene) => {
    console.log('[generate3DVisualizer] Génération du visualizer 3D, customModel:', !!customModel);

    if (customModel) {
        // Ne pas cloner, utiliser directement le modèle
        mesh = customModel;
        scene.add(mesh);
        console.log('[generate3DVisualizer] Modèle personnalisé ajouté à la scène:', mesh);
        return mesh;
    }

    console.log('[generate3DVisualizer] Création de la sphère par défaut');

    const geometry = new THREE.IcosahedronGeometry(1.5, 4);

    // Utiliser le shader configuré
    const shader = getShader3D(currentShaderName);
    const uniforms = {};
    for (const key in shader.uniforms) {
        uniforms[key] = { value: shader.uniforms[key].value };
    }

    const material = new THREE.ShaderMaterial({
        vertexShader: shader.vertex,
        fragmentShader: shader.fragment,
        uniforms: uniforms,
        side: THREE.DoubleSide
    });

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    return mesh;
};

export const update3DVisualizer = (audioData, time) => {
    if (!mesh) return;

    mesh.rotation.x += config.rotationSpeed * rotationSpeedMultiplier;
    mesh.rotation.y += config.rotationSpeed * rotationSpeedMultiplier;

    // Mettre à jour TOUS les uniforms possibles (chaque shader utilisera ceux dont il a besoin)
    if (mesh.material && mesh.material.uniforms) {
        const uniforms = mesh.material.uniforms;

        // Scale uniquement pour les shaders qui ne gèrent pas eux-mêmes la déformation
        const hasCustomDeformation = uniforms.u_spikeAmount !== undefined;
        if (!hasCustomDeformation) {
            const scale = 1 + audioData.overall * config.distortion;
            mesh.scale.set(scale, scale, scale);
        } else {
            mesh.scale.set(1, 1, 1); // Reset scale si déformation custom
        }

        // Temps
        if (uniforms.uTime) uniforms.uTime.value = time;
        if (uniforms.u_time) uniforms.u_time.value = time;

        // Audio - niveau global
        if (uniforms.uAudioData) uniforms.uAudioData.value = audioData.overall;
        if (uniforms.u_audioLevel) uniforms.u_audioLevel.value = audioData.overall;

        // Audio - fréquences séparées
        if (uniforms.u_bass) uniforms.u_bass.value = audioData.bass;
        if (uniforms.u_mid) uniforms.u_mid.value = audioData.mid;
        if (uniforms.u_treble) uniforms.u_treble.value = audioData.treble;

        // Audio - métriques avancées
        if (uniforms.u_peak) uniforms.u_peak.value = audioData.peak;
        if (uniforms.u_energy) uniforms.u_energy.value = audioData.energy;
    }    // Pour les modèles personnalisés, appliquer aussi aux enfants
    if (customModel && mesh.children && mesh.children.length > 0) {
        mesh.traverse((child) => {
            if (child.isMesh && child.material && child.material.uniforms) {
                const u = child.material.uniforms;
                // Temps
                if (u.uTime) u.uTime.value = time;
                if (u.u_time) u.u_time.value = time;
                // Audio global
                if (u.uAudioData) u.uAudioData.value = audioData.overall;
                if (u.u_audioLevel) u.u_audioLevel.value = audioData.overall;
                // Fréquences
                if (u.u_bass) u.u_bass.value = audioData.bass;
                if (u.u_mid) u.u_mid.value = audioData.mid;
                if (u.u_treble) u.u_treble.value = audioData.treble;
                // Métriques
                if (u.u_peak) u.u_peak.value = audioData.peak;
                if (u.u_energy) u.u_energy.value = audioData.energy;
            }
        });
    }
};

export const cleanup3DVisualizer = (scene) => {
    if (mesh) {
        scene.remove(mesh);
        if (mesh.geometry) mesh.geometry.dispose();
        if (mesh.material) {
            if (Array.isArray(mesh.material)) {
                mesh.material.forEach(mat => mat.dispose());
            } else {
                mesh.material.dispose();
            }
        }
        mesh = null;
    }
};

export const resetToDefaultModel = () => {
    console.log('[resetToDefaultModel] Réinitialisation du modèle');
    customModel = null;
    currentShaderName = 'normals';
};

export const setShader3D = (shaderName, scene) => {
    if (!mesh || !scene) return;

    const shader = getShader3D(shaderName);

    // Si c'est un modèle personnalisé (groupe), appliquer le shader à tous les enfants
    if (customModel && mesh.children && mesh.children.length > 0) {
        mesh.traverse((child) => {
            if (child.isMesh) {
                // Créer les uniforms pour ce mesh
                const uniforms = {};
                for (const key in shader.uniforms) {
                    uniforms[key] = { value: shader.uniforms[key].value };
                }

                // Préserver les valeurs actuelles si elles existent
                if (child.material && child.material.uniforms) {
                    if (child.material.uniforms.uTime && uniforms.uTime) {
                        uniforms.uTime.value = child.material.uniforms.uTime.value;
                    }
                    if (child.material.uniforms.uAudioData && uniforms.uAudioData) {
                        uniforms.uAudioData.value = child.material.uniforms.uAudioData.value;
                    }
                }

                // Créer et appliquer le nouveau matériau
                const newMaterial = new THREE.ShaderMaterial({
                    vertexShader: shader.vertex,
                    fragmentShader: shader.fragment,
                    uniforms: uniforms,
                    side: THREE.DoubleSide
                });

                if (child.material) {
                    child.material.dispose();
                }
                child.material = newMaterial;
            }
        });
    } else {
        // Modèle simple (géométrie de base)
        const uniforms = {};
        for (const key in shader.uniforms) {
            uniforms[key] = { value: shader.uniforms[key].value };
        }

        // Préserver les valeurs actuelles si elles existent
        if (mesh.material && mesh.material.uniforms) {
            if (mesh.material.uniforms.uTime && uniforms.uTime) {
                uniforms.uTime.value = mesh.material.uniforms.uTime.value;
            }
            if (mesh.material.uniforms.uAudioData && uniforms.uAudioData) {
                uniforms.uAudioData.value = mesh.material.uniforms.uAudioData.value;
            }
        }

        // Créer le nouveau matériau
        const newMaterial = new THREE.ShaderMaterial({
            vertexShader: shader.vertex,
            fragmentShader: shader.fragment,
            uniforms: uniforms,
            side: THREE.DoubleSide
        });

        // Remplacer le matériau
        if (mesh.material) {
            mesh.material.dispose();
        }
        mesh.material = newMaterial;
    }

    currentShaderName = shaderName;
};

export const loadCustomModel = (modelUrl, extension) => {
    return new Promise((resolve, reject) => {
        let loader;

        switch (extension) {
            case 'obj':
                loader = new OBJLoader();
                loader.load(
                    modelUrl,
                    (object) => {
                        customModel = object;
                        setupModel(object);
                        resolve(object);
                    },
                    undefined,
                    reject
                );
                break;

            case 'fbx':
                loader = new FBXLoader();
                loader.load(
                    modelUrl,
                    (object) => {
                        customModel = object;
                        setupModel(object);
                        resolve(object);
                    },
                    undefined,
                    reject
                );
                break;

            case 'glb':
            case 'gltf':
                loader = new GLTFLoader();
                loader.load(
                    modelUrl,
                    (gltf) => {
                        customModel = gltf.scene;
                        setupModel(gltf.scene);
                        resolve(gltf.scene);
                    },
                    undefined,
                    reject
                );
                break;

            default:
                reject(new Error(`Format non supporté: ${extension}`));
        }
    });
};

const setupModel = (model) => {
    // Calculer les bounds avant toute transformation
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);

    if (maxDim === 0) {
        console.warn('Modèle avec dimension nulle détecté');
        return;
    }

    // Obtenir le centre des bounds
    const center = box.getCenter(new THREE.Vector3());

    // Créer un groupe pour pouvoir centrer correctement
    const group = new THREE.Group();

    // Retirer le modèle de son parent si nécessaire et l'ajouter au groupe
    if (model.parent) {
        model.parent.remove(model);
    }
    group.add(model);

    // Déplacer le modèle pour que son centre soit à l'origine du groupe
    model.position.x = -center.x;
    model.position.y = -center.y;
    model.position.z = -center.z;

    // Normaliser la taille du groupe
    const scale = 2 / maxDim;
    group.scale.set(scale, scale, scale);

    // Remplacer customModel par le groupe
    customModel = group;

    // Appliquer un matériau shader à tous les mesh
    const shader = getShader3D(currentShaderName);
    model.traverse((child) => {
        if (child.isMesh) {
            // Créer les uniforms pour ce mesh
            const uniforms = {};
            for (const key in shader.uniforms) {
                uniforms[key] = { value: shader.uniforms[key].value };
            }

            // Appliquer le shader matériau
            child.material = new THREE.ShaderMaterial({
                vertexShader: shader.vertex,
                fragmentShader: shader.fragment,
                uniforms: uniforms,
                side: THREE.DoubleSide
            });
        }
    });

    console.log('Modèle configuré:', {
        size: size,
        scale: scale,
        center: center,
        children: model.children.length
    });
};
