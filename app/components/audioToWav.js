// https://github.com/chromium/chromium/blob/77578ccb4082ae20a9326d9e673225f1189ebb63/third_party/blink/web_tests/webaudio/resources/audio-file-utils.js
// Utilities for creating a 16-bit PCM WAV file from an AudioBuffer
// when using Chrome testRunner, and for downloading an AudioBuffer as
// a float WAV file when running in a browser.
function writeString(s, a, offset) {
    for (let i = 0; i < s.length; ++i) {
        a[offset + i] = s.charCodeAt(i);
    }
}

function writeInt16(n, a, offset) {
    n = Math.floor(n);

    let b1 = n & 255;
    let b2 = (n >> 8) & 255;

    a[offset + 0] = b1;
    a[offset + 1] = b2;
}

function writeInt32(n, a, offset) {
    n = Math.floor(n);
    let b1 = n & 255;
    let b2 = (n >> 8) & 255;
    let b3 = (n >> 16) & 255;
    let b4 = (n >> 24) & 255;

    a[offset + 0] = b1;
    a[offset + 1] = b2;
    a[offset + 2] = b3;
    a[offset + 3] = b4;
}

// Return the bits of the float as a 32-bit integer value.  This
// produces the raw bits; no intepretation of the value is done.
function floatBits(f) {
    let buf = new ArrayBuffer(4);
    new Float32Array(buf)[0] = f;
    let bits = new Uint32Array(buf)[0];
    // Return as a signed integer.
    return bits | 0;
}

function writeAudioBuffer(audioBuffer, a, offset, asFloat) {
    // let n = audioBuffer.length;
    let n = audioBuffer.reduce((a, b) => a + b.length, 0);
    // let channels = audioBuffer.numberOfChannels;
    let channels = audioBuffer.length;

    for (let i = 0; i < n; ++i) {
        for (let k = 0; k < channels; ++k) {
        // let buffer = audioBuffer.getChannelData(k);
        let buffer = audioBuffer[k];
        if (asFloat) {
            let sample = floatBits(buffer[i]);
            writeInt32(sample, a, offset);
            offset += 4;
        } else {
            let sample = buffer[i] * 32768.0;

            // Clip samples to the limitations of 16-bit.
            // If we don't do this then we'll get nasty wrap-around distortion.
            if (sample < -32768) sample = -32768;
            if (sample > 32767) sample = 32767;

            writeInt16(sample, a, offset);
            offset += 2;
        }
        }
    }
}

// See http://soundfile.sapp.org/doc/WaveFormat/ and
// http://www-mmsp.ece.mcgill.ca/Documents/AudioFormats/WAVE/WAVE.html
// for a quick introduction to the WAVE PCM format.
function createWaveFileData(audioBuffer, asFloat, sampleRate) {
    let bytesPerSample = asFloat ? 4 : 2;
    let frameLength = audioBuffer[0].length; //audioBuffer.length;
    let numberOfChannels = audioBuffer.length; // audioBuffer.numberOfChannels;
    // let sampleRate = audioBuffer.sampleRate;
    let bitsPerSample = 8 * bytesPerSample;
    let byteRate = (sampleRate * numberOfChannels * bitsPerSample) / 8;
    let blockAlign = (numberOfChannels * bitsPerSample) / 8;
    let wavDataByteLength = frameLength * numberOfChannels * bytesPerSample;
    let headerByteLength = 44;
    let totalLength = headerByteLength + wavDataByteLength;
    let waveFileData = new Uint8Array(totalLength);
    let subChunk1Size = 16; // for linear PCM
    let subChunk2Size = wavDataByteLength;
    let chunkSize = 4 + (8 + subChunk1Size) + (8 + subChunk2Size);
    writeString('RIFF', waveFileData, 0);
    writeInt32(chunkSize, waveFileData, 4);
    writeString('WAVE', waveFileData, 8);
    writeString('fmt ', waveFileData, 12);
    writeInt32(subChunk1Size, waveFileData, 16); // SubChunk1Size (4)
    // The format tag value is 1 for integer PCM data and 3 for IEEE
    // float data.
    writeInt16(asFloat ? 3 : 1, waveFileData, 20); // AudioFormat (2)
    writeInt16(numberOfChannels, waveFileData, 22); // NumChannels (2)
    writeInt32(sampleRate, waveFileData, 24); // SampleRate (4)
    writeInt32(byteRate, waveFileData, 28); // ByteRate (4)
    writeInt16(blockAlign, waveFileData, 32); // BlockAlign (2)
    writeInt32(bitsPerSample, waveFileData, 34); // BitsPerSample (4)
    writeString('data', waveFileData, 36);
    writeInt32(subChunk2Size, waveFileData, 40); // SubChunk2Size (4)
    // Write actual audio data starting at offset 44.
    writeAudioBuffer(audioBuffer, waveFileData, 44, asFloat);

    return waveFileData;
}

function createAudioData(audioBuffer, asFloat, sampleRate) {
    return createWaveFileData(audioBuffer, asFloat, sampleRate);
}

// Save the given |audioBuffer| to a WAV file using the name given by
// |filename|.  This is intended to be run from a browser.  The
// developer is expected to use the console to run downloadAudioBuffer
// when necessary to create a new reference file for a test.  If
// |asFloat| is given and is true, the WAV file produced uses 32-bit
// float format (full WebAudio resolution).  Otherwise a 16-bit PCM
// WAV file is produced.
function downloadAudioBuffer(
audioBuffer,
/* filename, */ asFloat,
sampleRate
) {
console.log(audioBuffer, asFloat, sampleRate);
let wavData = createAudioData(
    audioBuffer,
    /* filename, */ asFloat,
    sampleRate
);
let blob = new Blob([wavData], { type: 'audio/wav' });
return blob;
}

function audioInputToWav(audioInput, asFloat = false) {
// TODO handle possible audio inputs
let mediaElement,
    mediaStream,
    mediaStreamTrack,
    blob,
    file,
    blobURL,
    mediaFragmentURI,
    url,
    audioBuffer,
    array,
    typedArray;

switch (Object.getPrototypeOf(audioInput).constructor.name) {
    case 'AudioBuffer':
    console.log(audioInput);
    case 'HTMLAudioElement':
    case 'HTMLVideoElement':
    console.log(audioInput);
    break;
    case 'MediaStream':
    console.log(audioInput);
    break;
    case 'MediaStreamTrack':
    console.log(audioInput);
    break;
    case 'Blob':
    case 'File':
    console.log(audioInput);
    break;
    case 'String':
    console.log(audioInput);
    break;
    case 'Array':
    console.log(audioInput);
    break;
    case 'Float32Array':
    console.log(audioInput);
    break;
    case 'ArrayBuffer':
    console.log(audioInput);
    break;
    case 'Uint8Array':
    console.log(audioInput);
    break;
    case 'Uint16Array':
    console.log(audioInput);
    break;
    default:
    break;
}
}

const input = document.querySelector('input[type=file]');
const mediaElement = document.querySelector('audio');

input.onchange = async (e) => {
const [file] = e.target.files;
let now = performance.now();
const ac = new AudioContext({ latencyHint: 0, sampleRate: 22050 });
let ab = await ac.decodeAudioData(await file.arrayBuffer());
let { sampleRate } = ab;
ab = Array.from({ length: ab.numberOfChannels }, (_, i) =>
    ab.getChannelData(i)
);
const blob = downloadAudioBuffer(ab, false, sampleRate);
// audioInputToWav(blob);
console.log((performance.now() - now) / 1000);
/*
    0.06749999988824129
    0.048599999863654375
    0.08129999996162951
    0.0941000001039356
    0.08059999998658895
*/
const audio = new Audio(URL.createObjectURL(blob));
audio.controls = audio.autoplay = true;
document.body.appendChild(audio);
};
