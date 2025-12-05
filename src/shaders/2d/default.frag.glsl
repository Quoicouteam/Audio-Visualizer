uniform float uTime;
uniform float uAudioData;
varying vec2 vUv;

void main() {
    vec2 center = vUv - 0.5;
    float dist = length(center);

    // Blanc par défaut avec effet ripple
    float intensity = 1.0 + uAudioData * 0.5;
    vec3 color = vec3(1.0, 1.0, 1.0) * intensity;

    float pattern = sin(dist * 20.0 - uTime * 2.0) * 0.5 + 0.5;
    color *= pattern;

    gl_FragColor = vec4(color, 1.0);
}
