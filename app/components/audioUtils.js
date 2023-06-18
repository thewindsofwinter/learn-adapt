// audioUtils.js

// Utility function to encode audio chunks into base64 WAV format
export function encodeWAVToBase64(audioChunks) {
    // Create a WAV file header
    const header = createWAVHeader(audioChunks.length * 2, 44100, 16, 1);
    
    // Concatenate the header and audio data
    const audioData = header + audioChunks.join('');
    
    // Convert the audio data to base64
    const base64Data = btoa(audioData);
    
    return base64Data;
  }
  
  // Utility function to create a WAV file header
  function createWAVHeader(dataLength, sampleRate, bitDepth, numChannels) {
    const totalLength = dataLength + 44;
    const buffer = new ArrayBuffer(44);
    const view = new DataView(buffer);
    
    // Set the RIFF chunk descriptor
    writeString(view, 0, 'RIFF');
    view.setUint32(4, totalLength - 8, true);
    writeString(view, 8, 'WAVE');
    
    // Set the fmt sub-chunk
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // Audio Format: PCM
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numChannels * (bitDepth / 8), true);
    view.setUint16(32, numChannels * (bitDepth / 8), true);
    view.setUint16(34, bitDepth, true);
    
    // Set the data sub-chunk
    writeString(view, 36, 'data');
    view.setUint32(40, dataLength, true);
    
    // Return the header as a binary string
    return String.fromCharCode.apply(null, new Uint8Array(buffer));
  }
  
  // Utility function to write a string to a DataView
  function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }
  