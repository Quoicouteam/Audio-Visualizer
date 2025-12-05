// Liquid Metal Shader - Vertex
// Surface with fluid, mercury-like waves

uniform float u_time;
uniform float u_audioLevel;
uniform float u_bass;
uniform float u_mid;
uniform float u_treble;
uniform float u_peak;

// Liquid parameters
uniform float u_waveScale;
uniform float u_waveSpeed;
uniform float u_viscosity;
uniform float u_dropIntensity;

varying vec3 vPosition;
varying vec3 vNormal;
varying float vDisplacement;

#define PI 3.14159265359

// Simple noise function
float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float noise(vec3 x) {
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    
    return mix(
        mix(mix(hash(p + vec3(0,0,0)), hash(p + vec3(1,0,0)), f.x),
            mix(hash(p + vec3(0,1,0)), hash(p + vec3(1,1,0)), f.x), f.y),
        mix(mix(hash(p + vec3(0,0,1)), hash(p + vec3(1,0,1)), f.x),
            mix(hash(p + vec3(0,1,1)), hash(p + vec3(1,1,1)), f.x), f.y),
        f.z);
}

void main() {
    vec3 pos = position;
    
    // Distance from center for radial waves
    float dist = length(position.xy);
    
    // Multiple concentric waves
    float wave1 = sin(dist * u_waveScale - u_time * u_waveSpeed) * 0.3;
    float wave2 = sin(dist * u_waveScale * 1.5 - u_time * u_waveSpeed * 1.3) * 0.2;
    float wave3 = cos(dist * u_waveScale * 0.7 + u_time * u_waveSpeed * 0.8) * 0.15;
    
    // Audio-reactive waves
    float bassWave = sin(dist * 5.0 - u_time * 2.0) * u_bass * 0.5;
    float midWave = sin(dist * 8.0 + u_time * 3.0) * u_mid * 0.3;
    
    // Noise for organic movement
    vec3 noisePos = position * 2.0 + vec3(u_time * 0.3);
    float noiseVal = noise(noisePos) * u_viscosity * 0.3;
    
    // Drop impacts from peaks
    float dropWave = 0.0;
    float dropTime = mod(u_time, 3.0); // Drop every 3 seconds
    float dropRadius = dropTime * 2.0;
    float dropFalloff = exp(-abs(dist - dropRadius) * 2.0);
    dropWave = sin(dist * 10.0 - dropTime * 10.0) * dropFalloff * u_dropIntensity;
    
    // Peak creates splash
    float peakSplash = u_peak * sin(dist * 15.0 - u_time * 20.0) * exp(-dist * 0.5);
    
    // Treble creates ripples
    float trebleRipple = sin(dist * 20.0 - u_time * 15.0) * u_treble * 0.2 * exp(-dist * 0.3);
    
    // Combine all displacements
    float displacement = wave1 + wave2 + wave3 + bassWave + midWave + noiseVal + dropWave + peakSplash + trebleRipple;
    
    // Apply displacement along normal
    pos += normal * displacement;
    
    // Calculate new normal (approximate)
    float epsilon = 0.01;
    vec3 posX = position + vec3(epsilon, 0.0, 0.0);
    vec3 posZ = position + vec3(0.0, 0.0, epsilon);
    
    float distX = length(posX.xy);
    float distZ = length(posZ.xy);
    
    float dispX = sin(distX * u_waveScale - u_time * u_waveSpeed) * 0.3 + sin(distX * 5.0 - u_time * 2.0) * u_bass * 0.5;
    float dispZ = sin(distZ * u_waveScale - u_time * u_waveSpeed) * 0.3 + sin(distZ * 5.0 - u_time * 2.0) * u_bass * 0.5;
    
    vec3 tangentX = normalize(vec3(epsilon, 0.0, dispX - displacement));
    vec3 tangentZ = normalize(vec3(0.0, epsilon, dispZ - displacement));
    vec3 newNormal = cross(tangentZ, tangentX);
    
    vPosition = pos;
    vNormal = normalize(normalMatrix * newNormal);
    vDisplacement = displacement;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
