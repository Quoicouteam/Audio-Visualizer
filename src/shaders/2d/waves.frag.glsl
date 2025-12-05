// Shader 2D Waves
// Vagues colorées avec rotation

precision mediump float;

uniform float uTime;
uniform float uAudioData;
uniform float u_speed;
uniform float u_intensity;
uniform float u_scale;
uniform sampler2D uTexture;
uniform bool uHasTexture;

varying vec2 vUv;

#define N 40
#define PI2 (3.14159265*2.0)

void main() {
    // Convertir les coordonnées UV en coordonnées centrées
    vec2 resolution = vec2(800.0, 800.0);
    vec2 fragCoord = vUv * resolution;
    vec2 v = (fragCoord - resolution/2.0) / min(resolution.y, resolution.x) * (15.0 * u_scale);
    
    float t = uTime * u_speed - uAudioData * 15.0;
    
    // Utiliser l'audio pour contrôler le facteur et la rotation
    float factor = uAudioData * u_intensity + 0.5;
    float rotationAngle = uAudioData / 15.0 * PI2 * 0.5;
    float c = cos(rotationAngle);
    float s = sin(rotationAngle);
    
    for (int i = 1; i <= N; i++) {
        float d = float(i+3) / float(N);
        float x = v.x;
        float y = v.y + sin(v.x * d * 7.0 + t)/d*factor + cos(v.x * d + t)/d*factor;
        
        v.x = x * c - y * s;
        v.y = x * s + y * c;
    }
    
    float col = length(v) * 0.25;
    vec3 color = vec3(cos(col), cos(col*2.0), cos(col*4.0));
    
    // Appliquer le masque alpha de la texture si présente
    float alpha = 1.0;
    if (uHasTexture) {
        vec4 texColor = texture2D(uTexture, vUv);
        alpha = texColor.a;
    }
    
    gl_FragColor = vec4(color, alpha);
}
