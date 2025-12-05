// Blooming Flower Shader - Fragment
// Colorful petals with gradients

uniform float u_time;
uniform float u_audioLevel;
uniform float u_bass;
uniform float u_mid;
uniform float u_treble;
uniform float u_peak;
uniform vec3 u_color1; // Petal color
uniform vec3 u_color2; // Center color
uniform vec3 u_color3; // Accent color

varying vec3 vPosition;
varying vec3 vNormal;
varying float vPetalId;
varying float vRadialPos;

void main() {
    // Color gradient from center to petal edge
    float gradientFactor = clamp(vRadialPos * 2.0, 0.0, 1.0);
    
    // Mix between center and petal color
    vec3 baseColor = mix(u_color2, u_color1, gradientFactor);
    
    // Add accent color at petal tips
    if (gradientFactor > 0.7) {
        float tipMix = (gradientFactor - 0.7) / 0.3;
        baseColor = mix(baseColor, u_color3, tipMix);
    }
    
    // Alternating petal colors
    float petalMod = mod(vPetalId, 2.0);
    if (petalMod > 0.5) {
        baseColor = mix(baseColor, u_color3, 0.3);
    }
    
    // Audio-reactive brightness
    float audioBrightness = u_mid * 0.3 + u_treble * 0.2;
    baseColor += audioBrightness;
    
    // Lighting
    vec3 lightDir = normalize(vec3(0.5, 1.0, 0.3));
    float diff = max(dot(vNormal, lightDir), 0.0);
    float ambient = 0.5;
    
    // Translucency effect for petals
    vec3 backLight = vec3(0.0, -1.0, 0.0);
    float backDiff = max(dot(vNormal, backLight), 0.0);
    float translucency = backDiff * 0.3 * gradientFactor;
    
    // Peak flash
    float flash = u_peak * 0.5;
    
    vec3 finalColor = baseColor * (ambient + diff * 0.7) + translucency * u_color1 + flash;
    
    gl_FragColor = vec4(finalColor, 1.0);
}
