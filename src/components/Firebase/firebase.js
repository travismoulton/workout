import app from 'firebase/app';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyD0ikjJ5GfckmGG7ku0iE3zQRupx5VeC4E',
  authDomain: 'workout-81691.firebaseapp.com',
  databaseURL: 'https://workout-81691-default-rtdb.firebaseio.com',
  projectId: 'workout-81691',
  storageBucket: 'workout-81691.appspot.com',
  messagingSenderId: '939195302901',
  appId: '1:939195302901:web:9647324c9d5fda602196bc',
  measurementId: 'G-TBTJKG5ZMQ',
};

class Firebase {
  constructor() {
    app.initializeApp(firebaseConfig);

    this.auth = app.auth();
  }

  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => console.log(userCredential));

  doSignOut = () => this.auth.signOut();

  doPasswordReset = (email) => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = (password) =>
    this.auth.currentUser.updatePassword(password);
}

export default Firebase;
