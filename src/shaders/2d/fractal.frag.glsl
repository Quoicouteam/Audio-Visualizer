// Fractal 2D Fragment Shader - Audio Reactive Mandelbulb
// Based on shader by evilryu
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

uniform float uTime;
uniform float uAudioData;
uniform float u_bass;
uniform float u_mid;
uniform float u_treble;
uniform float u_peak;
uniform vec2 u_resolution;

// Fractal parameters
uniform float u_power;          // Mandelbulb power (default 8.0)
uniform float u_iterations;     // Number of iterations (default 7.0)
uniform float u_bailout;        // Bailout radius (default 2.0)
uniform vec3 u_color1;          // Base color
uniform vec3 u_color2;          // Accent color
uniform float u_rotationSpeed;  // Rotation speed
uniform float u_cameraDistance; // Camera distance

// Texture support
uniform sampler2D uTexture;
uniform bool uHasTexture;

varying vec2 vUv;

float stime, ctime;

void ry(inout vec3 p, float a) {  
    float c, s;
    vec3 q = p;  
    c = cos(a);
    s = sin(a);  
    p.x = c * q.x + s * q.z;  
    p.z = -s * q.x + c * q.z; 
}

// Mandelbulb distance estimator - audio reactive
vec3 mandelbulb(vec3 p) {
    p.xyz = p.xzy;
    vec3 z = p;
    // Morphing power over time + audio (audio adds to time-based changes)
    float timeMorph = sin(uTime * 0.3) * 2.0 + cos(uTime * 0.17) * 1.5;
    float power = u_power + timeMorph + u_bass * 2.0; // Time morphing with bass accent
    float r, theta, phi;
    float dr = 1.0;
    
    float t0 = 1.0;
    // Time-based iteration variation + audio
    float timeIterMod = sin(uTime * 0.2) * 2.0;
    int maxIter = int(u_iterations + timeIterMod + u_mid * 3.0); // Time + mid frequencies affect detail
    float dynamicBailout = u_bailout + sin(uTime * 0.25) * 0.5 + u_peak * 1.0; // Time + peak affects bailout
    
    for(int i = 0; i < 12; ++i) {
        if(i >= maxIter) break;
        
        r = length(z);
        if(r > dynamicBailout) continue;
        
        theta = atan(z.y, z.x);
        // Treble creates phase shifting
        phi = asin(z.z / r) + u_treble * 0.5;
        
        dr = pow(r, power - 1.0) * dr * power + 1.0;
    
        r = pow(r, power);
        theta = theta * power;
        phi = phi * power;
        
        z = r * vec3(cos(theta)*cos(phi), sin(theta)*cos(phi), sin(phi)) + p;
        
        t0 = min(t0, r);
    }
    return vec3(0.5 * log(r) * r / dr, t0, 0.0);
}

vec3 f(vec3 p) { 
    ry(p, uTime * u_rotationSpeed);
    return mandelbulb(p); 
}

float softshadow(vec3 ro, vec3 rd, float k) { 
    float akuma = 1.0, h = 0.0; 
    float t = 0.01;
    for(int i = 0; i < 50; ++i) { 
        h = f(ro + rd * t).x; 
        if(h < 0.001) return 0.02; 
        akuma = min(akuma, k * h / t); 
        t += clamp(h, 0.01, 2.0); 
    } 
    return akuma; 
}

vec3 nor(in vec3 pos) {
    vec3 eps = vec3(0.001, 0.0, 0.0);
    return normalize(vec3(
        f(pos + eps.xyy).x - f(pos - eps.xyy).x,
        f(pos + eps.yxy).x - f(pos - eps.yxy).x,
        f(pos + eps.yyx).x - f(pos - eps.yyx).x
    ));
}

vec3 intersect(in vec3 ro, in vec3 rd) {
    float pixel_size = 1.0 / (u_resolution.x * 3.0);
    float t = 1.0;
    float res_t = 0.0;
    float res_d = 1000.0;
    vec3 c, res_c;
    float max_error = 1000.0;
    float d = 1.0;
    float pd = 100.0;
    float os = 0.0;
    float step = 0.0;
    float error = 1000.0;
    
    for(int i = 0; i < 48; i++) {
        if(error < pixel_size * 0.5 || t > 20.0) {
            break;
        }
        
        c = f(ro + rd * t);
        d = c.x;

        if(d > os) {
            os = 0.4 * d * d / pd;
            step = d + os;
            pd = d;
        } else {
            step = -os;
            os = 0.0;
            pd = 100.0;
            d = 1.0;
        }

        error = d / t;

        if(error < max_error) {
            max_error = error;
            res_t = t;
            res_c = c;
        }
        
        t += step;
    }
    
    if(t > 20.0) res_t = -1.0;
    return vec3(res_t, res_c.y, res_c.z);
}

void main() {
    vec2 q = vUv;
    vec2 uv = -1.0 + 2.0 * q;
    uv.x *= u_resolution.x / u_resolution.y;
    
    // Camera setup - audio reactive
    stime = 0.7 + 0.3 * sin(uTime * 0.4);
    ctime = 0.7 + 0.3 * cos(uTime * 0.4);

    vec3 ta = vec3(0.0, 0.0, 0.0);
    vec3 ro = vec3(0.0, u_cameraDistance * stime * ctime, u_cameraDistance * (1.0 - stime * ctime));

    vec3 cf = normalize(ta - ro);
    vec3 cs = normalize(cross(cf, vec3(0.0, 1.0, 0.0)));
    vec3 cu = normalize(cross(cs, cf));
    vec3 rd = normalize(uv.x * cs + uv.y * cu + 3.0 * cf);

    vec3 sundir = normalize(vec3(0.1, 0.8, 0.6));
    vec3 sun = vec3(1.64, 1.27, 0.99);
    vec3 skycolor = vec3(0.6, 1.5, 1.0);

    vec3 bg = exp(uv.y - 2.0) * vec3(0.4, 1.6, 1.0);

    float halo = clamp(dot(normalize(vec3(-ro.x, -ro.y, -ro.z)), rd), 0.0, 1.0);
    vec3 col = bg + vec3(1.0, 0.8, 0.4) * pow(halo, 17.0);

    vec3 res = intersect(ro, rd);
    float alpha = 1.0;
    
    if(res.x > 0.0) {
        vec3 p = ro + res.x * rd;
        vec3 n = nor(p);
        float shadow = softshadow(p, sundir, 10.0);

        float dif = max(0.0, dot(n, sundir));
        float sky = 0.6 + 0.4 * max(0.0, dot(n, vec3(0.0, 1.0, 0.0)));
        float bac = max(0.3 + 0.7 * dot(vec3(-sundir.x, -1.0, -sundir.z), n), 0.0);
        float spe = max(0.0, pow(clamp(dot(sundir, reflect(rd, n)), 0.0, 1.0), 10.0));

        vec3 lin = 4.5 * sun * dif * shadow;
        lin += 0.8 * bac * sun;
        lin += 0.6 * sky * skycolor * shadow;
        lin += 3.0 * spe * shadow;

        res.y = pow(clamp(res.y, 0.0, 1.0), 0.55);
        
        // Audio-reactive coloring
        vec3 tc0 = 0.5 + 0.5 * sin(3.0 + 4.2 * res.y + vec3(0.0, 0.5, 1.0));
        vec3 baseColor = mix(u_color1, u_color2, res.y);
        col = lin * baseColor * 0.2 * tc0;
        
        // Bass adds glow
        col += u_bass * 0.3 * baseColor;
        
        col = mix(col, bg, 1.0 - exp(-0.001 * res.x * res.x));
        alpha = smoothstep(0.55, 0.76, 1.0 - res.x / 5.0);
    } else {
        alpha = 0.0;
    }

    // Post processing
    col = pow(clamp(col, 0.0, 1.0), vec3(0.45));
    col = col * 0.6 + 0.4 * col * col * (3.0 - 2.0 * col);
    col = mix(col, vec3(dot(col, vec3(0.33))), -0.5);
    col *= 0.5 + 0.5 * pow(16.0 * q.x * q.y * (1.0 - q.x) * (1.0 - q.y), 0.7);
    
    // Alpha masking with texture
    if(uHasTexture) {
        vec4 texColor = texture2D(uTexture, vUv);
        alpha *= texColor.a;
    }
    
    gl_FragColor = vec4(col, alpha);
}
