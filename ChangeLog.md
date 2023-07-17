# Change log

All notable changes to this project are documented in this file.

## 17/07/2023, 12:43pm
Added functionality to add the correct tables to the database when it connects and fucntionailty for get requests to be recieved that will return the text, inputted audio (Depending on which get request), and the date of every record in the database. Fixed bugs of data being inserted before tables were created.

## 17/07/2023, 10:29am
Added the functionality to check if the database already exists in the working dictionary, if it doesn't it then creates a database and the appropriate tables. Fixed bugs where the promise of data being inserted wasn't being resolved before moving on.

## 14/07/2023, 4:23pm
Added validation to check that audio passed in the push request is base 64 encoded.

## 14/07/2023, 4:07pm
Added the functionality for the program to connect to an SQLite3 database and store the result from the Google Speech to Text API in the database. Added exception handling.

## 14/07/2023, 12:10pm
No functionality added. Cleaned up code.

## 14/07/2023, 12:00pm
Implemented the express dependancy. Created a RESTful endpoint. Allowed for user to send a push request to http://localhost:8040/get_text reading the base 64 encoded audio from a JSON file in the request's body. This audio passed in the push request is then passed into the Google Speech to Text request.

## 13/07/2023, 3:41pm
No functionality added. Cleaned up code, seperating it into more precise, smaller functions.

## 13/07/2023, 3:28pm
Added the functionality to accept a file path of a flac recording as a command line argument, read that file and convert it to a base 64 encoded string which is then passed into the Google Speech to Text API request. Removed the need for Google Buckets.

## 13/07/2023, 3:12pm
Added the functionality to read a user's google cloud service account key, and submit a request to the Google Speech to Text API, passing the address of a fixed flac file in a Google Bucket.