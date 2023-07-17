const sqlite3 = require('sqlite3')
const express = require('express');
const app = express();
const PORT = 8040;
const speech = require('@google-cloud/speech');
const path = require('path');
const fs = require('fs');
var base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;

app.use(express.json({limit: '100mb'}));
const keyFilename = path.join(__dirname, 'key.json');
const client = new speech.SpeechClient({
  keyFilename: keyFilename
});

async function connectToDatabase(Writing) {
  try{
    let database = fs.statSync("./SpeechToText.db");
    database.isFile();
    let db = new sqlite3.Database('./SpeechToText.db', sqlite3.OPEN_READWRITE);
    await createTables(db).catch(() => {return true;});
    return db;
  } catch {
    if(Writing){
      let db = await createDatabase().catch(() => {return true;});
      return db;
    } else {
      return true;
    }
  }
}

async function createDatabase(){
  return new Promise((resolve, reject) => {
    let db = new sqlite3.Database('SpeechToText.db', async (err) => {
      if (err) {
          reject(true);
      } else {
        await createTables(db).catch(() => {reject(true);});
        resolve(db);
      }
    });
  })
}

async function createTables(db){
  return new Promise((resolve, reject) => {
    db.run('CREATE TABLE IF NOT EXISTS Entries(id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT, inputtedAudio TEXT, dateAdded TEXT);', [], function(err) {
      if(err){
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
}

async function insertEntry(text, audioBytes, db){
  return new Promise((resolve, reject) => {
    const date = new Date();
    let dateAdded = date.toLocaleDateString();
    db.run('INSERT INTO Entries (text, inputtedAudio, dateAdded) VALUES (?,?,?)', [text, audioBytes, dateAdded], function(err) {
      if (err){
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
}

async function getEntriesAsJSON(db, includeInputtedAudio){
  return new Promise((resolve, reject) => {
    if(includeInputtedAudio){
      db.all('SELECT text, inputtedAudio, dateAdded FROM Entries', (err, rows) => {
        if(err){
          reject("Failed to access Enteries in database, please check if there is an Entries table in the database");
        } else {
          resolve(JSON.stringify(rows));
        }
      });
    } else {
      db.all('SELECT text, dateAdded FROM Entries', (err, rows) => {
        if(err){
          reject("Failed to access Enteries in database, please check if there is an Entries table in the database");
        } else {
          resolve(JSON.stringify(rows));
        }
      });
    }
  })
}

async function getEntries(includeInputtedAudio){
let db = await connectToDatabase(false);
  if(!db){
    return "Failed to connect to database";
  }
  try{
    let JSONResults = await getEntriesAsJSON(db, includeInputtedAudio);
    return JSONResults;
  } catch (err){
    return err;
  }
}

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

app.post('/get_speech_as_text', async (req, res) => {
  const {audio} = req.body;
  if(!audio || !audio.data) {
    return res.status(418).send({message: "A FLAC audio file is required as input"})
  }
  try {
    if(!base64Regex.test(audio.data)){
      return res.status(500).send({message:"The file pass was not base 64 encoded"});
    }
    let text = await getText(audio.data);
    let db = await connectToDatabase(true);
    if(!db){
      return res.status(500).send({message:"Failed to connect to database / create tables in database"});
    }
    let successfulInsertion = await insertEntry(text, audio.data, db).catch(() => false);
    if(successfulInsertion){
      return res.status(200).send({message: "Wayhey!"})
    } else {
      return res.status(500).send({message:"Failed to insert entry into database"});
    }
  } catch (e){
    console.log(e);
    return res.status(500).send({message:"An error occurred"});
  }
})

app.get('/get_text_results', async(req, res) => {
  returnValue = await getEntries(false);
  try{
    JSON.parse(returnValue);
    res.set({'Content-Type': 'application/json'});
    res.status(200).send(returnValue);
  } catch {
    return res.status(500).send({message:returnValue});
  }
})


app.get('/get_text_results_and_audio', async(req, res) => {
  returnValue = await getEntries(true);
  try{
    JSON.parse(returnValue);
    res.set({'Content-Type': 'application/json'});
    res.status(200).send(returnValue);
  } catch {
    return res.status(500).send({message:returnValue});
  }
})