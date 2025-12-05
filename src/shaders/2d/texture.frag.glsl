uniform float uTime;
uniform float uAudioData;
uniform sampler2D uTexture;
varying vec2 vUv;

void main() {
    // Calculer la distance depuis le centre pour l'effet ripple
    vec2 center = vUv - 0.5;
    float dist = length(center);
    
    // Effet ripple basé sur la distance
    float ripple = sin(dist * 15.0 - uTime * 3.0) * 0.5 + 0.5;
    float rippleIntensity = uAudioData * 0.3 * ripple;
    
    // Charger la couleur de la texture
    vec4 texColor = texture2D(uTexture, vUv);
    
    // Appliquer l'intensité audio et l'effet ripple
    float intensity = 1.0 + uAudioData * 0.3;
    vec3 color = texColor.rgb * intensity;
    
    // Ajouter l'effet ripple localement (pas uniformément)
    color += vec3(rippleIntensity);

    gl_FragColor = vec4(color, texColor.a);
}
