// Shader 2D Rings
// Anneaux colorés animés réactifs à l'audio

precision mediump float;

uniform float uTime;
uniform float uAudioData;
uniform float u_speed;
uniform float u_scale;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform vec3 u_color3;
uniform sampler2D uTexture;
uniform bool uHasTexture;

varying vec2 vUv;

void main() {
    float dist = 0.11;
    float radius = 7.1 * u_scale;
    
    vec3 Color = u_color1;
    vec3 Colorb = u_color2;
    vec3 Colorc = u_color3;
    float col = -0.3;
    float colb = -0.3;
    float colc = -0.3;
    
    // Convertir les coordonnées UV en coordonnées centrées
    vec2 resolution = vec2(800.0, 600.0); // Résolution approximative
    vec2 fragCoord = vUv * resolution;
    vec2 centr = 11.2 * (fragCoord * 2.0 - resolution) / min(resolution.x, resolution.y);
    
    // Réactivité audio
    float audioInfluence = uAudioData;
    float radiusModulated = radius + audioInfluence * 2.0;
    float speedModulated = uTime * u_speed * (1.0 + uAudioData * 0.5);
    
    for(float i = 0.0; i < 63.0; i++) {
        float si = sin(speedModulated + i * dist) * 1.05;
        float co = cos(speedModulated + i * dist) * 2.05;
        
        col += 0.003 / abs(length(centr + vec2(si + co * cos(speedModulated * 0.5), co)) - radiusModulated);
        colb += 0.003 / abs(length(centr + vec2(si - co * cos(speedModulated * 0.5), co)) - radiusModulated);
        colc += 0.003 / abs(length(centr + vec2(si - co * sin(speedModulated * 0.5), co)) - radiusModulated);
    }
    
    vec3 finalColor = vec3((Color * col) + (Colorb * colb) + (Colorc * colc));
    
    // Appliquer le masque alpha de la texture si présente
    float alpha = 1.0;
    if (uHasTexture) {
        vec4 texColor = texture2D(uTexture, vUv);
        alpha = texColor.a;
    }
    
    gl_FragColor = vec4(finalColor, alpha);
}
