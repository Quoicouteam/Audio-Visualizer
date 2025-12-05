// Sobel Edge Detection
// Filtre de convolution pour détecter les contours

// Matrice Sobel X
const mat3 sobelX = mat3(
    -1.0, 0.0, 1.0,
    -2.0, 0.0, 2.0,
    -1.0, 0.0, 1.0
);

// Matrice Sobel Y
const mat3 sobelY = mat3(
    -1.0, -2.0, -1.0,
     0.0,  0.0,  0.0,
     1.0,  2.0,  1.0
);

// Détecte les bords avec Sobel
float sobelEdgeDetection(sampler2D tex, vec2 uv, vec2 resolution) {
    vec2 texelSize = 1.0 / resolution;
    
    float gx = 0.0;
    float gy = 0.0;
    
    // Parcourir la matrice 3x3
    for (int i = -1; i <= 1; i++) {
        for (int j = -1; j <= 1; j++) {
            vec2 offset = vec2(float(i), float(j)) * texelSize;
            float luminance = getLuminance(texture2D(tex, uv + offset).rgb);
            
            // Appliquer les kernels Sobel
            gx += luminance * sobelX[i + 1][j + 1];
            gy += luminance * sobelY[i + 1][j + 1];
        }
    }
    
    // Magnitude du gradient
    return sqrt(gx * gx + gy * gy);
}

// Retourne l'angle du gradient (pour edge direction)
float sobelEdgeAngle(sampler2D tex, vec2 uv, vec2 resolution) {
    vec2 texelSize = 1.0 / resolution;
    
    float gx = 0.0;
    float gy = 0.0;
    
    for (int i = -1; i <= 1; i++) {
        for (int j = -1; j <= 1; j++) {
            vec2 offset = vec2(float(i), float(j)) * texelSize;
            float luminance = getLuminance(texture2D(tex, uv + offset).rgb);
            
            gx += luminance * sobelX[i + 1][j + 1];
            gy += luminance * sobelY[i + 1][j + 1];
        }
    }
    
    return atan(gy, gx);
}

// Edge detection avec seuil
float sobelEdgeThreshold(sampler2D tex, vec2 uv, vec2 resolution, float threshold) {
    float edge = sobelEdgeDetection(tex, uv, resolution);
    return step(threshold, edge);
}

// Retourne la couleur des edges
vec3 sobelEdgeColor(sampler2D tex, vec2 uv, vec2 resolution, vec3 edgeColor, vec3 backgroundColor) {
    float edge = sobelEdgeDetection(tex, uv, resolution);
    return mix(backgroundColor, edgeColor, edge);
}

// Fonction de luminance (réutilisée)
float getLuminance(vec3 color) {
    return dot(color, vec3(0.299, 0.587, 0.114));
}
