// DNA Helix Shader - Fragment
// Colorful double helix with audio-reactive colors

uniform float u_time;
uniform float u_audioLevel;
uniform float u_bass;
uniform float u_mid;
uniform float u_treble;
uniform float u_peak;
uniform vec3 u_color1;
uniform vec3 u_color2;

varying vec3 vPosition;
varying vec3 vNormal;
varying float vStrand;
varying float vHeight;

void main() {
    // Different colors for each strand
    vec3 strand1Color = u_color1;
    vec3 strand2Color = u_color2;
    
    // Mix between strand colors
    vec3 baseColor = mix(strand1Color, strand2Color, vStrand);
    
    // Add height-based gradient
    float heightGradient = fract(vHeight * 0.5 + u_time * 0.2);
    vec3 gradientColor = mix(baseColor, baseColor * 1.5, heightGradient);
    
    // Audio-reactive glow
    float glow = u_bass * 0.5 + u_mid * 0.3;
    gradientColor += glow * baseColor;
    
    // Lighting
    vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
    float diff = max(dot(vNormal, lightDir), 0.0);
    float ambient = 0.4;
    
    // Peak flash
    float flash = u_peak * 0.5;
    
    vec3 finalColor = gradientColor * (ambient + diff * 0.6) + flash;
    
    gl_FragColor = vec4(finalColor, 1.0);
}
