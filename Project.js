const speech = require('@google-cloud/speech');
const path = require('path');
const fs = require('fs');

const keyFilename = path.join(__dirname, 'key.json');
const client = new speech.SpeechClient({
  keyFilename: keyFilename
});

function getFileAsBytes() {
  let filePathAddress = process.argv[2];
  let filePath = path.join(__dirname, filePathAddress);
  let audioBytes = fs.readFileSync(filePath);
  return audioBytes;
}

async function getText(audioBytes) {
  const audio = {
    content: audioBytes.toString('base64'),
  };
  const config = {
    encoding: 'FLAC',
    languageCode: 'en-UK',
  };
  const request = {
    audio: audio,
    config: config,
  };

  const [response] = await client.recognize(request);
  const transcription = response.results
    .map(result => result.alternatives[0].transcript)
    .join('\n');
  return transcription;
}

async function main() {
  if (!process.argv[2]) {
    console.log("A filepath to an audio file is required as a command line argument");
  } else {
    let audioBytes = getFileAsBytes();
    let text = await getText(audioBytes);
    console.log(`Transcription: ${text}`);
  }
}

main();


