// Shader 3D Spiky avec Perlin Noise amélioré
// Déplace les vertices vers l'extérieur basé sur le bruit de Perlin
// Importe le module perlinNoise.glsl

#include ../utils/perlinNoise.glsl;

uniform float u_time;
uniform float u_audioLevel;
uniform float u_bass;
uniform float u_mid;
uniform float u_treble;
uniform float u_peak;
uniform float u_baseAmount;
uniform float u_spikeAmount;
uniform float u_noiseScale;
uniform float u_noiseSpeed;

varying vec3 vNormal;
varying vec3 vPosition;
varying float vDisplacement;
varying float vAudioIntensity;

void main() {
    vec3 pos = position;
    
    // Utiliser les différentes fréquences pour différentes échelles de spikes
    // Bass pour les gros mouvements lents
    // Mid pour les spikes moyens
    // Treble pour les détails rapides
    
    // Calculer plusieurs octaves de bruit avec différentes échelles
    vec3 noiseInput1 = pos * u_noiseScale + vec3(u_time * u_noiseSpeed);
    vec3 noiseInput2 = pos * (u_noiseScale * 2.0) + vec3(u_time * u_noiseSpeed * 1.5);
    vec3 noiseInput3 = pos * (u_noiseScale * 0.5) + vec3(u_time * u_noiseSpeed * 0.7);
    
    float noise1 = fbm(noiseInput1, 4, 0.5, 2.0);
    float noise2 = fbm(noiseInput2, 3, 0.5, 2.0);
    float noise3 = fbm(noiseInput3, 2, 0.5, 2.0);
    
    // Convertir les bruits de [-1, 1] à [0, 1]
    noise1 = noise1 * 0.5 + 0.5;
    noise2 = noise2 * 0.5 + 0.5;
    noise3 = noise3 * 0.5 + 0.5;
    
    // Combiner les fréquences audio avec les différentes octaves de bruit
    // Bass -> grands spikes lents
    float bassDisplacement = pow(noise3, 3.0) * u_bass * u_spikeAmount * 0.8;
    
    // Mid -> spikes moyens, plus réactifs
    float midDisplacement = pow(noise1, 4.0) * u_mid * u_spikeAmount * 1.5;
    
    // Treble -> petits détails rapides
    float trebleDisplacement = pow(noise2, 6.0) * u_treble * u_spikeAmount * 1.2;
    
    // Peak pour des spikes soudains sur les beats
    float peakBoost = pow(u_peak, 3.0) * 0.5;
    
    // Déplacement de base lisse
    float baseNoise = noise1 * u_baseAmount * (u_audioLevel * 0.5 + 0.5);
    
    // Combiner tous les déplacements
    float displacement = baseNoise + bassDisplacement + midDisplacement + trebleDisplacement + peakBoost;
    
    // Ajouter une pulsation globale sur les beats
    float beatPulse = u_peak * 0.3;
    displacement += beatPulse;
    
    // Déplacer le vertex le long de sa normale
    vec3 newPosition = pos + normal * displacement;
    
    // Pass aux varying pour le fragment shader
    vNormal = normalize(normalMatrix * normal);
    vPosition = newPosition;
    vDisplacement = displacement;
    vAudioIntensity = u_bass * 0.3 + u_mid * 0.4 + u_treble * 0.3;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
