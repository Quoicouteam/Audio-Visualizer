// Shader 3D Wave
// Crée des vagues ondulantes basées sur l'audio

uniform float u_time;
uniform float u_audioLevel;
uniform float u_bass;
uniform float u_mid;
uniform float u_treble;
uniform float u_waveSpeed;
uniform float u_waveAmplitude;
uniform float u_audioInfluence;
uniform float u_waveScale;

varying vec3 vNormal;
varying vec3 vPosition;
varying float vWaveHeight;

void main() {
    vec3 pos = position;
    
    // Calculer le sinus basé sur la hauteur (Y) dans le monde
    vec4 worldPos = modelMatrix * vec4(pos, 1.0);
    
    float audioInfluence = u_bass * 0.5 + u_mid * 0.3 + u_treble * 0.2;
    float sineWave = sin(worldPos.y * u_waveScale + u_time * u_waveSpeed);
    float displacement = sineWave * u_waveAmplitude + sineWave * audioInfluence * u_audioInfluence;
    
    vec3 newPosition = pos + normal * displacement;
    
    vNormal = normalize(normalMatrix * normal);
    vPosition = newPosition;
    vWaveHeight = sineWave;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
