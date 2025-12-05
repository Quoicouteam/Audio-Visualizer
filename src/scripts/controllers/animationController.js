/**
 * Animation Controller
 * Gère le cycle d'animation requestAnimationFrame
 */

let animationId = null;
let animationCallback = null;

/**
 * Démarre la boucle d'animation
 * @param {Function} callback - Fonction appelée à chaque frame
 */
export const startAnimation = (callback) => {
    if (animationId !== null) {
        console.warn('Animation déjà en cours');
        return;
    }

    animationCallback = callback;
    animate();
};

/**
 * Arrête la boucle d'animation
 */
export const stopAnimation = () => {
    if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    animationCallback = null;
};

/**
 * Met en pause temporairement l'animation
 * @returns {boolean} - true si l'animation était active
 */
export const pauseAnimation = () => {
    const wasAnimating = animationId !== null;
    if (wasAnimating) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    return wasAnimating;
};

/**
 * Reprend l'animation si elle était active
 * @param {boolean} wasAnimating - Résultat de pauseAnimation
 */
export const resumeAnimation = (wasAnimating) => {
    if (wasAnimating && animationId === null && animationCallback) {
        animate();
    }
};

/**
 * Vérifie si l'animation est en cours
 * @returns {boolean}
 */
export const isAnimating = () => {
    return animationId !== null;
};

/**
 * Boucle d'animation interne
 */
const animate = () => {
    animationId = requestAnimationFrame(animate);

    if (animationCallback) {
        try {
            animationCallback();
        } catch (error) {
            console.error('Erreur dans le callback d\'animation:', error);
        }
    }
};
