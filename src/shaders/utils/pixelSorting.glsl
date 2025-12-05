// Pixel Sorting Utilities
// Fonctions pour trier les pixels selon différents critères

// Fonction de luminance
float getLuminance(vec3 color) {
    return dot(color, vec3(0.299, 0.587, 0.114));
}

// Fonction de saturation
float getSaturation(vec3 color) {
    float maxC = max(max(color.r, color.g), color.b);
    float minC = min(min(color.r, color.g), color.b);
    return maxC - minC;
}

// Fonction de teinte (hue)
float getHue(vec3 color) {
    float maxC = max(max(color.r, color.g), color.b);
    float minC = min(min(color.r, color.g), color.b);
    float delta = maxC - minC;
    
    if (delta == 0.0) return 0.0;
    
    float hue = 0.0;
    if (maxC == color.r) {
        hue = mod((color.g - color.b) / delta, 6.0);
    } else if (maxC == color.g) {
        hue = (color.b - color.r) / delta + 2.0;
    } else {
        hue = (color.r - color.g) / delta + 4.0;
    }
    
    return hue / 6.0;
}

// Trie les pixels dans une direction avec un seuil
vec3 sortPixels(sampler2D tex, vec2 uv, vec2 resolution, vec2 direction, float threshold, int sortLength, int sortMode) {
    vec3 currentColor = texture2D(tex, uv).rgb;
    float currentValue = getLuminance(currentColor);
    
    if (sortMode == 1) {
        currentValue = getSaturation(currentColor);
    } else if (sortMode == 2) {
        currentValue = getHue(currentColor);
    }
    
    // Si sous le seuil, pas de tri
    if (currentValue < threshold) {
        return currentColor;
    }
    
    // Collecter les pixels voisins
    vec3 sortedColor = currentColor;
    float maxValue = currentValue;
    
    for (int i = 1; i <= sortLength; i++) {
        vec2 offset = direction * float(i) / resolution;
        vec3 neighborColor = texture2D(tex, uv + offset).rgb;
        float neighborValue = getLuminance(neighborColor);
        
        if (sortMode == 1) {
            neighborValue = getSaturation(neighborColor);
        } else if (sortMode == 2) {
            neighborValue = getHue(neighborColor);
        }
        
        if (neighborValue > maxValue) {
            maxValue = neighborValue;
            sortedColor = neighborColor;
        }
    }
    
    return sortedColor;
}

// Version simplifiée pour sorting vertical
vec3 sortPixelsVertical(sampler2D tex, vec2 uv, vec2 resolution, float threshold, int sortLength) {
    return sortPixels(tex, uv, resolution, vec2(0.0, 1.0), threshold, sortLength, 0);
}

// Version simplifiée pour sorting horizontal
vec3 sortPixelsHorizontal(sampler2D tex, vec2 uv, vec2 resolution, float threshold, int sortLength) {
    return sortPixels(tex, uv, resolution, vec2(1.0, 0.0), threshold, sortLength, 0);
}

// Glitch pixel sorting (aléatoire)
vec3 glitchSort(sampler2D tex, vec2 uv, vec2 resolution, float time, float intensity) {
    float noise = fract(sin(dot(uv + time, vec2(12.9898, 78.233))) * 43758.5453);
    
    if (noise > intensity) {
        return texture2D(tex, uv).rgb;
    }
    
    vec2 direction = vec2(cos(time + noise * 6.28), sin(time + noise * 6.28));
    int sortLength = int(10.0 * intensity);
    
    return sortPixels(tex, uv, resolution, direction, 0.3, sortLength, 0);
}
