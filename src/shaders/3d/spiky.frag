precision highp float;

uniform vec3 u_color1;
uniform vec3 u_color2;
uniform float u_time;
uniform float u_peak;

varying vec3 vNormal;
varying vec3 vPosition;
varying float vDisplacement;
varying float vAudioIntensity;

void main() {
    // Normaliser la normale
    vec3 normal = normalize(vNormal);
    
    // Calculer un facteur basé sur le déplacement avec plus de contraste
    float displacementFactor = clamp(vDisplacement / 1.5, 0.0, 1.0);
    displacementFactor = pow(displacementFactor, 1.5); // Plus de contraste
    
    // Mélanger les couleurs basé sur le déplacement
    vec3 color = mix(u_color1, u_color2, displacementFactor);
    
    // Ajouter une couleur intense sur les spikes les plus grands
    vec3 spikeColor = vec3(1.0, 0.8, 0.0); // Couleur dorée/jaune
    float spikeHighlight = smoothstep(0.7, 1.0, displacementFactor);
    color = mix(color, spikeColor, spikeHighlight * 0.6);
    
    // Ajouter un éclairage dynamique
    vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
    float diffuse = max(dot(normal, lightDir), 0.0);
    
    // Ajouter une seconde source de lumière pour plus de dynamisme
    vec3 lightDir2 = normalize(vec3(-0.5, -1.0, 0.5));
    float diffuse2 = max(dot(normal, lightDir2), 0.0) * 0.4;
    
    
    // Éclairage ambiant qui pulse avec l'audio
    float ambient = 0.25 + vAudioIntensity * 0.25;
    
    // Combiner tous les éléments d'éclairage
    vec3 finalColor = color * (diffuse * 0.6 + diffuse2 + ambient);
    
    // Ajouter un flash sur les beats
    float beatFlash = pow(u_peak, 4.0) * 0.3;
    finalColor += vec3(beatFlash);
    
    gl_FragColor = vec4(finalColor, 1.0);
}
