precision highp float;

uniform vec3 u_color1;
uniform vec3 u_color2;
uniform float u_time;

varying vec3 vNormal;
varying vec3 vPosition;
varying float vWaveHeight;

void main() {
    // Normaliser la normale
    vec3 normal = normalize(vNormal);
    
    // Utiliser le sinus directement pour la couleur
    // vWaveHeight va de -1 à 1, on le normalise entre 0 et 1
    float sineFactor = vWaveHeight * 0.5 + 0.5;
    
    // Mélanger les couleurs basé sur le sinus
    vec3 color = mix(u_color1, u_color2, sineFactor);
    
    // Ajouter un éclairage simple
    vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
    float diffuse = max(dot(normal, lightDir), 0.0);
    
    // Ajouter un rim light
    vec3 viewDir = normalize(-vPosition);
    float rimPower = 1.0 - max(dot(viewDir, normal), 0.0);
    rimPower = pow(rimPower, 3.0);
    
    // Combiner tout
    vec3 finalColor = color * (diffuse * 0.7 + 0.3) + vec3(rimPower * 0.2);
    
    gl_FragColor = vec4(finalColor, 1.0);
}
