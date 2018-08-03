export default { 

  // 1) Create Accounts at Algolia and Google/Firebase to get these credentials.
  // 2) Copy this file to a new file named credentials.js in the same folder
  // 3) Then Fill in your credentials below

  // Initialize Algolia
  algolia:{
    appId:"xxxxxxxx",
    apiKey:"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  },
  // Initialize Firebase
  firebase:{
    apiKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    authDomain: 'your-database.firebaseapp.com',
    databaseURL: 'https://your-database.firebaseio.com',
    projectId: 'your-project-id',
    storageBucket: 'yourproject.appspot.com',
    messagingSenderId: 'xxxxxxxxxxx',
  },
}