// DNA Helix Shader - Vertex
// Double helix structure with audio reactivity

uniform float u_time;
uniform float u_audioLevel;
uniform float u_bass;
uniform float u_mid;
uniform float u_treble;
uniform float u_peak;

// DNA parameters
uniform float u_helixRadius;
uniform float u_helixHeight;
uniform float u_twistSpeed;
uniform float u_spacing;

varying vec3 vPosition;
varying vec3 vNormal;
varying float vStrand; // 0 or 1 for which helix strand
varying float vHeight;

#define PI 3.14159265359

void main() {
    vec3 pos = position;
    vec3 norm = normal;
    
    // Determine which strand (based on vertex position)
    vStrand = step(0.0, position.x);
    
    // Calculate height along the helix
    float heightFactor = position.y;
    vHeight = heightFactor;
    
    // Helix parameters affected by audio
    float radius = u_helixRadius + u_bass * 0.3; // Bass expands radius
    float spacing = u_spacing + u_mid * 2.0; // Mid affects spacing between strands
    
    // Create double helix twist
    float angle = heightFactor * u_twistSpeed + u_time * 0.5;
    float strandOffset = vStrand * PI; // Second strand offset by 180°
    
    // Position on helix
    float helixAngle = angle + strandOffset;
    float x = cos(helixAngle) * radius;
    float z = sin(helixAngle) * radius;
    float y = heightFactor * u_helixHeight;
    
    // Add connecting "rungs" vibration based on treble
    float rungVibration = 0.0;
    if (abs(position.x) < 0.1) { // Rungs are in the middle
        rungVibration = sin(u_time * 10.0 + heightFactor * 5.0) * u_treble * 0.2;
    }
    
    // Add peak pulse
    float pulse = u_peak * sin(heightFactor * 10.0 - u_time * 5.0) * 0.3;
    
    // Apply transformations
    pos.x = x + rungVibration + pulse;
    pos.y = y;
    pos.z = z;
    
    // Update normal for lighting
    vec3 tangent = normalize(vec3(-sin(helixAngle), u_helixHeight / u_twistSpeed, cos(helixAngle)));
    vec3 binormal = normalize(cross(tangent, vec3(cos(helixAngle), 0.0, sin(helixAngle))));
    norm = cross(binormal, tangent);
    
    vPosition = pos;
    vNormal = normalize(normalMatrix * norm);
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
