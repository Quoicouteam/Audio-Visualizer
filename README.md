# Audio Visualizer

Visualiseur audio 3D et 2D réactif développé pendant la Nuit de l'Info.

## Description

Application web de visualisation audio en temps réel avec shaders GLSL personnalisés. Le visualiseur analyse les fréquences audio (bass, mid, treble) et génère des animations 3D et 2D réactives.

## Technologies Utilisées

### Frontend
- **Vue.js 3** - Framework JavaScript avec Composition API
- **Three.js** - Moteur de rendu 3D WebGL
- **Vite** - Build tool et serveur de développement

### Graphisme
- **GLSL** - Shaders personnalisés pour vertex et fragment
- **WebGL** - Rendu graphique accéléré par GPU
- **Web Audio API** - Analyse de fréquences audio en temps réel

### Shaders Implémentés

#### Mode 3D
- **Spiky** - Géométrie à spikes réagissant aux différentes bandes de fréquences
- **Wave** - Déformation sinusoïdale verticale
- **DNA Helix** - Double hélice animée
- **Liquid Metal** - Surface liquide avec vagues concentriques
- **Blooming Flower** - Pétales qui s'ouvrent et se ferment

#### Mode 2D
- **Laser** - Effet de faisceau horizontal
- **Rings** - Anneaux concentriques colorés
- **Waves** - Motifs ondulatoires avec rotation
- **Fractal** - Mandelbulb raymarched avec morphing temporel

## Fonctionnalités

### Analyse Audio
- Séparation des fréquences en bass, mid et treble
- Détection de peaks pour les beats
- Support de fichiers audio et images personnalisés

### Contrôles
- Sélection de shaders en temps réel
- Paramètres ajustables par shader (vitesse, intensité, couleurs)
- Rotation 3D avec OrbitControls
- Mode plein écran pour visualisations 2D
- Support de textures avec masque alpha

### Architecture
```
src/
├── components/           # Composants Vue
│   ├── AudioControls.vue
│   ├── ShaderSelector.vue
│   └── ShaderParamsControl.vue
├── scripts/
│   ├── audioManager.js       # Gestion audio et analyse fréquences
│   ├── shaderManager.js      # Configuration des shaders
│   ├── 2DVisualizer.js       # Génération plane 2D
│   ├── 3DVisualizer.js       # Génération mesh 3D
│   └── controllers/          # Contrôleurs (caméra, scène, rendu)
└── shaders/
    ├── 2d/                   # Shaders fragment 2D
    └── 3d/                   # Shaders vertex et fragment 3D
```

## Installation

```bash
npm install
npm run dev
```

## Utilisation

1. Charger un fichier audio ou activer le microphone
2. Sélectionner un mode (2D ou 3D)
3. Choisir un shader dans le sélecteur
4. Ajuster les paramètres selon vos préférences
5. Optionnel: charger une image personnalisée (mode 2D avec masque alpha)

## Développement

Projet réalisé lors de la Nuit de l'Info, démontrant l'intégration de technologies web modernes pour créer des visualisations audio interactives et performantes.
