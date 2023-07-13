const speech = require('@google-cloud/speech');
const path = require('path');
const fs = require('fs');

const keyFilename = path.join(__dirname, 'key.json');
const client = new speech.SpeechClient({
  keyFilename: keyFilename
});

async function getText() {
    let filePathAddress = process.argv[2];
    filePath = path.join(__dirname, filePathAddress);
    audioBytes = fs.readFileSync(filePath);
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
    console.log(`Transcription: ${transcription}`);
}

getText();

