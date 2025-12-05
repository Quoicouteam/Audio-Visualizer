// Liquid Metal Shader - Fragment
// Metallic, reflective surface

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
varying float vDisplacement;

void main() {
    // Metallic base colors
    vec3 metalColor1 = u_color1;
    vec3 metalColor2 = u_color2;
    
    // Mix based on displacement
    float mixFactor = clamp(vDisplacement * 2.0 + 0.5, 0.0, 1.0);
    vec3 baseColor = mix(metalColor1, metalColor2, mixFactor);
    
    // Specular lighting for metallic look
    vec3 lightDir = normalize(vec3(1.0, 1.0, 0.5));
    vec3 viewDir = normalize(vec3(0.0, 0.0, 1.0));
    vec3 reflectDir = reflect(-lightDir, vNormal);
    
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
    float diff = max(dot(vNormal, lightDir), 0.0);
    
    // Fresnel effect
    float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 3.0);
    
    // Audio-reactive shine
    float audioShine = u_mid * 0.5 + u_treble * 0.3;
    
    // Combine lighting
    vec3 ambient = baseColor * 0.3;
    vec3 diffuse = baseColor * diff * 0.5;
    vec3 specular = vec3(1.0) * spec * (1.0 + audioShine);
    vec3 fresnelColor = metalColor2 * fresnel * 0.5;
    
    // Peak flash
    float flash = u_peak * 0.7;
    
    vec3 finalColor = ambient + diffuse + specular + fresnelColor + flash;
    
    gl_FragColor = vec4(finalColor, 1.0);
}
