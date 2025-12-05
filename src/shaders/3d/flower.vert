// Blooming Flower Shader - Vertex
// Petals that open and close with audio

uniform float u_time;
uniform float u_audioLevel;
uniform float u_bass;
uniform float u_mid;
uniform float u_treble;
uniform float u_peak;

// Flower parameters
uniform float u_petalCount;
uniform float u_bloomAmount;
uniform float u_petalCurve;
uniform float u_centerSize;

varying vec3 vPosition;
varying vec3 vNormal;
varying float vPetalId;
varying float vRadialPos;

#define PI 3.14159265359

void main() {
    vec3 pos = position;
    
    // Determine angle and radius
    float angle = atan(position.x, position.z);
    float normalizedAngle = (angle + PI) / (2.0 * PI);
    
    // Create petal segments
    float petalSegment = normalizedAngle * u_petalCount;
    vPetalId = floor(petalSegment);
    float petalPhase = fract(petalSegment); // 0 to 1 within petal
    
    // Distance from center (in XZ plane)
    float radius = length(position.xz);
    vRadialPos = radius;
    
    // Bloom amount affected by bass
    float bloomFactor = u_bloomAmount + u_bass * 0.5;
    bloomFactor = clamp(bloomFactor, 0.0, 1.5);
    
    // Normalize radius
    float normalizedRadius = clamp(radius / 1.0, 0.0, 1.0);
    
    // Center stays mostly fixed
    if (normalizedRadius < u_centerSize) {
        // Center pulsates with mid frequencies
        float centerPulse = 1.0 + u_mid * 0.2;
        pos *= centerPulse;
    } else {
        // Outside center - create petal effect
        float radialFactor = (normalizedRadius - u_centerSize) / (1.0 - u_centerSize);
        
        // Petal shape - wider at middle, narrower at tip
        float petalShape = sin(petalPhase * PI);
        
        // Scale based on petal shape
        float petalScale = 1.0 + petalShape * 0.3 * bloomFactor;
        
        // Opening angle - rotate outward from center
        float openingAngle = bloomFactor * radialFactor * 1.2; // More dramatic opening
        
        // Current position in spherical coords
        float currentY = position.y;
        float currentRadius = radius;
        
        // Apply opening by rotating outward
        float newY = currentY - radialFactor * bloomFactor * 0.5; // Push down/out
        float expansion = 1.0 + bloomFactor * radialFactor * 0.8; // Expand outward
        
        // Apply to position
        pos.x = position.x * expansion * petalScale;
        pos.z = position.z * expansion * petalScale;
        pos.y = newY;
        
        // Add petal curve upward at tips
        float tipCurve = radialFactor * radialFactor * u_petalCurve * bloomFactor;
        pos.y += tipCurve;
        
        // Treble makes petals flutter
        float flutter = sin(u_time * 10.0 + vPetalId * 2.0) * u_treble * 0.15 * radialFactor;
        pos.y += flutter;
    }
    
    // Peak makes entire flower pulse
    float peakPulse = 1.0 + u_peak * 0.2;
    pos *= peakPulse;
    
    // Stamen in center vibrates with audio
    if (radius < u_centerSize * 0.5) {
        float stamenVibration = sin(u_time * 5.0) * u_audioLevel * 0.1;
        pos.y += stamenVibration;
    }
    
    vPosition = pos;
    vNormal = normalize(normalMatrix * normal);
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
