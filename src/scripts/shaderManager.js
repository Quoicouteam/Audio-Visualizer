// Gestionnaire de shaders modulaire

// Shaders 2D
import defaultVertexShader from '../shaders/2d/default.vert.glsl';
import laserFragmentShader from '../shaders/2d/laser.frag.glsl';
import ringsFragmentShader from '../shaders/2d/rings.frag.glsl';
import wavesFragmentShader from '../shaders/2d/waves.frag.glsl';
import fractalFragmentShader from '../shaders/2d/fractal.frag.glsl';

// Shaders 3D
import spikyVertexShader from '../shaders/3d/spiky.vert';
import spikyFragmentShader from '../shaders/3d/spiky.frag';
import waveVertexShader from '../shaders/3d/wave.vert';
import waveFragmentShader from '../shaders/3d/wave.frag';
import dnaVertexShader from '../shaders/3d/dna.vert';
import dnaFragmentShader from '../shaders/3d/dna.frag';
import liquidVertexShader from '../shaders/3d/liquid.vert';
import liquidFragmentShader from '../shaders/3d/liquid.frag';
import flowerVertexShader from '../shaders/3d/flower.vert';
import flowerFragmentShader from '../shaders/3d/flower.frag';

// Configuration des shaders 2D disponibles
export const shaders2D = {
    laser: {
        name: 'Laser',
        vertex: defaultVertexShader,
        fragment: laserFragmentShader,
        uniforms: {
            uTime: { value: 0 },
            uAudioData: { value: 0 },
            u_speed: { value: 3.0 },
            u_intensity: { value: 1.0 },
            u_color: { value: [1.7, 0.2, 3.0] },
            uTexture: { value: null },
            uHasTexture: { value: false }
        }
    },
    rings: {
        name: 'Anneaux',
        vertex: defaultVertexShader,
        fragment: ringsFragmentShader,
        uniforms: {
            uTime: { value: 0 },
            uAudioData: { value: 0 },
            u_speed: { value: 1.0 },
            u_scale: { value: 1.0 },
            u_color1: { value: [0.9, 0.0, 0.0] },
            u_color2: { value: [0.0, 0.9, 0.0] },
            u_color3: { value: [0.0, 0.0, 0.9] },
            uTexture: { value: null },
            uHasTexture: { value: false }
        }
    },
    waves: {
        name: 'Vagues',
        vertex: defaultVertexShader,
        fragment: wavesFragmentShader,
        uniforms: {
            uTime: { value: 0 },
            uAudioData: { value: 0 },
            u_speed: { value: 1.0 },
            u_intensity: { value: 1.0 },
            u_scale: { value: 1.0 },
            uTexture: { value: null },
            uHasTexture: { value: false }
        }
    },
    fractal: {
        name: 'Fractal',
        vertex: defaultVertexShader,
        fragment: fractalFragmentShader,
        uniforms: {
            uTime: { value: 0 },
            uAudioData: { value: 0 },
            u_bass: { value: 0.0 },
            u_mid: { value: 0.0 },
            u_treble: { value: 0.0 },
            u_peak: { value: 0.0 },
            u_resolution: { value: [window.innerWidth, window.innerHeight] },
            u_power: { value: 8.0 },
            u_iterations: { value: 7.0 },
            u_bailout: { value: 2.0 },
            u_rotationSpeed: { value: 0.2 },
            u_cameraDistance: { value: 3.0 },
            u_color1: { value: [0.9, 0.8, 0.6] },
            u_color2: { value: [0.6, 0.3, 0.8] },
            uTexture: { value: null },
            uHasTexture: { value: false }
        }
    }
};

// Fonction pour obtenir un shader par son nom
export const getShader2D = (shaderName = 'laser') => {
    return shaders2D[shaderName] || shaders2D.laser;
};

// Liste des shaders disponibles pour l'UI
export const getAvailableShaders2D = () => {
    return Object.keys(shaders2D).map(key => ({
        id: key,
        name: shaders2D[key].name
    }));
};

// Configuration des shaders 3D disponibles
export const shaders3D = {
    spiky: {
        name: 'Spiky',
        vertex: spikyVertexShader,
        fragment: spikyFragmentShader,
        uniforms: {
            u_time: { value: 0.0 },
            u_audioLevel: { value: 0.0 },
            u_bass: { value: 0.0 },
            u_mid: { value: 0.0 },
            u_treble: { value: 0.0 },
            u_peak: { value: 0.0 },
            u_baseAmount: { value: 0.5 },
            u_spikeAmount: { value: 5.0 },
            u_noiseScale: { value: 10.0 },
            u_noiseSpeed: { value: 0.01 },
            u_color1: { value: [0.2, 0.5, 1.0] },
            u_color2: { value: [1.0, 0.3, 0.5] }
        }
    },
    wave: {
        name: 'Wave',
        vertex: waveVertexShader,
        fragment: waveFragmentShader,
        uniforms: {
            u_time: { value: 0.0 },
            u_audioLevel: { value: 0.0 },
            u_bass: { value: 0.0 },
            u_mid: { value: 0.0 },
            u_treble: { value: 0.0 },
            u_waveSpeed: { value: 2.0 },
            u_waveAmplitude: { value: 0.1 },
            u_audioInfluence: { value: 1.0 },
            u_waveScale: { value: 6.0 },
            u_color1: { value: [0.1, 0.3, 0.8] },
            u_color2: { value: [0.3, 0.8, 1.0] }
        }
    },
    dna: {
        name: 'DNA Helix',
        vertex: dnaVertexShader,
        fragment: dnaFragmentShader,
        uniforms: {
            u_time: { value: 0.0 },
            u_audioLevel: { value: 0.0 },
            u_bass: { value: 0.0 },
            u_mid: { value: 0.0 },
            u_treble: { value: 0.0 },
            u_peak: { value: 0.0 },
            u_helixRadius: { value: 0.5 },
            u_helixHeight: { value: 2.0 },
            u_twistSpeed: { value: 3.0 },
            u_spacing: { value: 1.0 },
            u_color1: { value: [0.2, 0.5, 1.0] },
            u_color2: { value: [1.0, 0.2, 0.5] }
        }
    },
    liquid: {
        name: 'Liquid Metal',
        vertex: liquidVertexShader,
        fragment: liquidFragmentShader,
        uniforms: {
            u_time: { value: 0.0 },
            u_audioLevel: { value: 0.0 },
            u_bass: { value: 0.0 },
            u_mid: { value: 0.0 },
            u_treble: { value: 0.0 },
            u_peak: { value: 0.0 },
            u_waveScale: { value: 3.0 },
            u_waveSpeed: { value: 2.0 },
            u_viscosity: { value: 1.0 },
            u_dropIntensity: { value: 0.5 },
            u_color1: { value: [0.7, 0.8, 0.9] },
            u_color2: { value: [0.3, 0.4, 0.6] }
        }
    },
    flower: {
        name: 'Blooming Flower',
        vertex: flowerVertexShader,
        fragment: flowerFragmentShader,
        uniforms: {
            u_time: { value: 0.0 },
            u_audioLevel: { value: 0.0 },
            u_bass: { value: 0.0 },
            u_mid: { value: 0.0 },
            u_treble: { value: 0.0 },
            u_peak: { value: 0.0 },
            u_petalCount: { value: 8.0 },
            u_bloomAmount: { value: 0.8 },
            u_petalCurve: { value: 1.5 },
            u_centerSize: { value: 0.3 },
            u_color1: { value: [1.0, 0.3, 0.5] },
            u_color2: { value: [1.0, 0.9, 0.2] },
            u_color3: { value: [1.0, 0.6, 0.8] }
        }
    }
};

// Fonction pour obtenir un shader 3D par son nom
export const getShader3D = (shaderName = 'spiky') => {
    return shaders3D[shaderName] || shaders3D.spiky;
};

// Liste des shaders 3D disponibles pour l'UI
export const getAvailableShaders3D = () => {
    return Object.keys(shaders3D).map(key => ({
        id: key,
        name: shaders3D[key].name
    }));
};

// Obtenir les paramètres modifiables d'un shader 3D
export const getShader3DParams = (shaderName = 'spiky') => {
    const shader = shaders3D[shaderName] || shaders3D.spiky;
    return shader.uniforms;
};

// Obtenir les paramètres modifiables d'un shader 2D
export const getShader2DParams = (shaderName = 'laser') => {
    const shader = shaders2D[shaderName] || shaders2D.laser;
    return shader.uniforms;
};
