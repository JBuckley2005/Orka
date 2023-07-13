const speech = require('@google-cloud/speech');
const path = require('path');

const keyFilename = path.join(__dirname, 'key.json');
const client = new speech.SpeechClient({
  keyFilename: keyFilename
});

async function getText() {
    const audio = {
        uri: 'gs://lskss/Recording.flac',
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
