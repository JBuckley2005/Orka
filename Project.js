const express = require('express');
const app = express();
const PORT = 8040;
const speech = require('@google-cloud/speech');
const path = require('path');
const fs = require('fs');
const base64Regex = "/^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/";

app.use(express.json({limit: '100mb'}));
const keyFilename = path.join(__dirname, 'key.json');
const client = new speech.SpeechClient({
  keyFilename: keyFilename
});

async function getText(audioBytes) {
    const config = {
      encoding: 'FLAC',
      languageCode: 'en-UK',
    };
    const request = {
      audio: {content : audioBytes},
      config: config,
    };
    
    const [response] = await client.recognize(request);
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
    return transcription;
}

app.listen(
  PORT, 
  () => console.log('Its alive on https://localhost:8040')
)

app.post('/get_text', async (req, res) => {
  const {audio} = req.body;
  if(!audio || !audio.data) {
    return res.status(418).send({message: "A FLAC audio file is required as input"})
  }

  try {
    let audioBytes = audio.data;
    // This would test if the inputted file was 64 bit encoded but the regex test takes too long 
    // if (base64Regex.test(audioBytes)){
    //    let text = await getText(audioBytes);
    //    console.log("Text result:", text);
    //    res.send({message: "Wayhey!"})
    // } else {
    //   return res.status(500, {message:"The file pass was not base 64 encoded"});
    // }
    let text = await getText(audioBytes);
    console.log("Text result:", text);
    res.send({message: "Wayhey!"})
  } catch {
    return res.status(500, {message:"An error has occurred"});
  }
})