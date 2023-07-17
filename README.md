# README
This project was based off an software engineering interview question given to me to complete.

## Table of Contents

1. [Description of problem](#description-of-problem)
1. [Set up](#set-up)
1. [Usage](#usage)

## Description of problem:

Create a restful endpoint that intakes a base64encoded FLAC audio file and stores the transcribed text into a DB table along with the time the request was made.
Google Speech API docs: https://cloud.google.com/speech-to-text
This is to be written in a framework you are familiar with, however we require unit tests and expect to see regular commits to demonstrate your approach to the task. 
Please submit this via a github repo link, with a README file. Include project setup steps and instructions to connect to your endpoint.


After completing this task, I have then further extended the project to include the ability to fetch the data stored in the database when a get request is recieved. Aswell as creating a database, if one is not already in the same directory as Project.js. I have written this project in javascript, implementing a sqlite3 database.

## Set up:

### Install Dependinces 
First, Node JS will be required. This can be installed at https://nodejs.org/en/download. 
Once Node JS is set up, in the command line, install the Google Cloud Speech, Express and SQLite3 dependencies. This is done by running the commands, npm install express, npm install @google-cloud/speech, npm install sqlite3.

If your computer does not come with SQLite3 installed, you will need to install it.

### Authorizing Google API 
For this project, you will need to enable the Google Speech-to-Text API in the Google Cloud console. Once you have selected a project and linked it to a billing account, you can enable the Speech-to-Text API. Go to the Search products and resources bar at the top of the page and type in "speech". Select the Cloud Speech-to-Text API from the list of results. You now must link one or more service accounts to the Speech-to-Text API. Click on the Credentials menu item on the left side of the Speech-to-Text API main page. Make sure billing is enabled for the API and that the project has at least one service account. A private key for that google service account is required. This will need to be stored in a file called key.json in the same directory as Project.js. Instructions for this are listed below:

You need to obtain credentials in the form of a public/private key pair. These credentials are used the code to authorize service account actions within your app.
To obtain credentials:
In the Google Cloud console, go to Menu menu > IAM & Admin > Service Accounts.
Go to Service Accounts
Select your service account.
Click Keys > Add key > Create new key.
Select JSON, then click Create.
Your new public/private key pair is generated and downloaded to your machine as a new file. Save the downloaded JSON file as key.json in your working directory.

### Files to download
Download package-lock.json, package.json and Project.js and place them in the same folder. 

## Usage:
You can connect to the endpoint of the project using an application like postman and connecting to http://localhost:8040/.

### Push requests

To have an audio file converted into text, send a post request to http://localhost:8040/get_speech_as_text with the body of that request containing a JSON file with an Object "audio" containing the based 64 encoded version of the flac audio file in the data property of the audio object. This can be created by using the conversion tool, https://base64.guru/converter/encode/audio/flac, which will convert your flac file to a correctly formatted json file. This will connect to the Google Speech to Text API and will store the text, inputted audio and date of the post request in a database titled SpeechToText.db (If this database does not already exist, it will create it). 

### Get requests

If you wish to get the results of your post requests then you can send either one of two get requests to http://localhost:8040/. 

Sending a get request to http://localhost:8040/get_text_results will return the text in the audio and the date of the text being added in a JSON file. 

Sending a get request to http://localhost:8040/get_text_results_and_audio will return the text in the audio, the audio inputted and the date of the text being added in a JSON file.