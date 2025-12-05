uniform float uTime;
uniform float uAudioData;
uniform sampler2D uTexture;
uniform bool uHasTexture;
varying vec2 vUv;

void main() {
    vec2 center = vUv - 0.5;
    float dist = length(center);
    
    // Créer des cercles concentriques
    float circles = sin(dist * 30.0 - uTime * 2.0) * 0.5 + 0.5;
    
    // Couleur cyan/magenta
    vec3 color1 = vec3(0.0, 1.0, 1.0); // Cyan
    vec3 color2 = vec3(1.0, 0.0, 1.0); // Magenta
    vec3 color = mix(color1, color2, circles);
    
    // Intensité basée sur l'audio
    color *= (1.0 + uAudioData * 0.8);

    // Appliquer le masque alpha de la texture si présente
    float alpha = 1.0;
    if (uHasTexture) {
        vec4 texColor = texture2D(uTexture, vUv);
        alpha = texColor.a;
    }

    gl_FragColor = vec4(color, alpha);
}
