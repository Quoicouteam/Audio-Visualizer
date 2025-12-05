let audioContext;
let analyser;
let dataArray;

export const setupAudio = (audioElement) => {
    if (!audioContext) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        audioContext = new AudioCtx();

        const source = audioContext.createMediaElementSource(audioElement);
        analyser = audioContext.createAnalyser();

        analyser.fftSize = 512;
        source.connect(analyser);
        analyser.connect(audioContext.destination);

        dataArray = new Uint8Array(analyser.frequencyBinCount);
    }

    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
};

export const getAudioData = () => {
    if (!analyser) {
        return {
            bass: 0,
            mid: 0,
            treble: 0,
            overall: 0,
            bassRaw: 0,
            midRaw: 0,
            trebleRaw: 0,
            peak: 0,
            energy: 0,
            spectrum: []
        };
    }

    analyser.getByteFrequencyData(dataArray);

    const bufferLength = dataArray.length;
    const bassEnd = Math.floor(bufferLength * 0.1);
    const midEnd = Math.floor(bufferLength * 0.4);

    const bassRange = dataArray.slice(0, bassEnd);
    const midRange = dataArray.slice(bassEnd, midEnd);
    const trebleRange = dataArray.slice(midEnd, bufferLength);

    const bassRaw = bassRange.reduce((a, b) => a + b) / bassRange.length;
    const midRaw = midRange.reduce((a, b) => a + b) / midRange.length;
    const trebleRaw = trebleRange.reduce((a, b) => a + b) / trebleRange.length;

    const overall = dataArray.reduce((a, b) => a + b) / bufferLength;
    const peak = Math.max(...dataArray);

    const energy = Math.sqrt(
        dataArray.reduce((sum, val) => sum + val * val, 0) / bufferLength
    );

    return {
        bass: bassRaw / 255,
        mid: midRaw / 255,
        treble: trebleRaw / 255,
        overall: overall / 255,
        bassRaw,
        midRaw,
        trebleRaw,
        peak: peak / 255,
        energy: energy / 255,
        spectrum: Array.from(dataArray)
    };
};
