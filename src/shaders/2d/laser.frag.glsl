// Shader 2D Laser
// Effet laser horizontal réactif à l'audio

precision mediump float;

uniform float uTime;
uniform float uAudioData;
uniform float u_speed;
uniform float u_intensity;
uniform vec3 u_color;
uniform sampler2D uTexture;
uniform bool uHasTexture;

varying vec2 vUv;

vec3 lazer(vec2 pos, vec3 clr, float mult, float audioInfluence)
{
    float x = uTime * u_speed * 2.0 * (1.0 + audioInfluence * 0.5);
    float w = fract(x * 0.5);
    w = sin(3.14159 * w);
    w *= 1.5 + pos.x;
    w *= 2.0 + audioInfluence * 2.0;
    vec3 color = clr * mult * w / abs(pos.y);

    float d = distance(pos, vec2(-1.0 + fract(x * 0.5) * 2.0, 0.0));
    color += (clr * 0.25 * w / d);
    return color;
}

void main()
{
    vec2 pos = (vUv * 2.0) - 1.0;
    
    // Utiliser l'audio pour intensifier l'effet
    float audioInfluence = uAudioData;
    
    vec3 color = max(vec3(0.0), lazer(pos, u_color, 0.25 + audioInfluence * 0.5, audioInfluence));
    
    // Appliquer le masque alpha de la texture si présente
    float alpha = 1.0;
    if (uHasTexture) {
        vec4 texColor = texture2D(uTexture, vUv);
        alpha = texColor.a;
    }
    
    gl_FragColor = vec4(color * u_intensity * (0.05 + audioInfluence * 0.15), alpha);
}
