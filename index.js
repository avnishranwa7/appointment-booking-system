const express = require('express');
const cors = require('cors');

const app = express();
const port = 5000;

const admin = require('firebase-admin');
const serviceAccount = require("./serviceAccountKey.json");

const { initializeApp } = require('firebase/app');
const { getDatabase, ref, onValue, set, update } = require('firebase/database');
const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } = require('firebase/auth');

const firebaseConfig = {
    apiKey: "AIzaSyAu2qKqPjkarTbBufPzqPgItV-8620TGCU",
    authDomain: "appointment-booking-syst-de40a.firebaseapp.com",
    databaseURL: "https://appointment-booking-syst-de40a-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "appointment-booking-syst-de40a",
    storageBucket: "appointment-booking-syst-de40a.appspot.com",
    messagingSenderId: "666888361731",
    appId: "1:666888361731:web:62917b3f702e2bc2dcfb36",
    measurementId: "G-HKFYY3ERRT"
};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// const adminAuth = getAuth(firebaseApp);

initializeApp(firebaseConfig);
const db = getDatabase();

const auth = getAuth();

const requireAuth = async (req, res, next) => {
    try{
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new Error('Unauthorized');
        }
        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    }catch(error){
        res.status(401).json({ error: 'Unauthorized' });
    }
}

app.use(cors());
app.use(express.json())

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});

app.get('/',(req,res) => {
    res.send('Hello World Second time111');
})

app.post('/register', (req, res) =>{
    if(!req.body["password"].match("/^[A-Za-z]\w{7,14}$/")){
        res.send("Password can only contain characters, numeric digits, underscore, first character must be letter and length should be 7 to 16.");
    }
    createUserWithEmailAndPassword(auth, req.body["email"], req.body["password"])
    .then((userCredential) =>{
        res.send(userCredential);
    })
    .catch((error)=>{
        console.log(error.message);
    })
})

app.post('/login', async (req, res)=>{
    await signInWithEmailAndPassword(auth, req.body["email"], req.body["password"])
    .then((userCredential) =>{
        res.send(userCredential);
        console.log(userCredential.user.stsTokenManager.accessToken);
    })
    .catch((error)=>{
        console.log(error.message);
    });
})

app.get('/users', requireAuth, (req, res) =>{
    const data = ref(db, 'users/');
    onValue(data, (snapshot)=>{
        const d = snapshot.val();
        res.send(d);
    })
})

app.post('/users', requireAuth, (req, res) =>{
    const body = req.body;

    const id = Object.keys(body)[0];
    const firstName = req.body[id]["first name"];
    const lastName = req.body[id]["last name"];

    const data = {"first name": firstName, "last name": lastName};

    const jsonObject = {};
    jsonObject[id] = data;
    console.log(jsonObject);

    update(ref(db, 'users/'), jsonObject);
    res.send(body);
})

app.get('/users/:userID', requireAuth, async(req, res) =>{
    const userID = req.params['userID'];
    const dataRef = ref(db, 'users/');

    var userData = "";

    onValue(dataRef, (snapshot)=>{
        const data = snapshot.val();
        const IDs = Object.keys(data);
        IDs.forEach((id, index)=>{
            if(id==userID){
                userData = data[id];
                res.send(userData);
            }
        })
    })
})

app.put('/users/:userID', requireAuth, (req, res)=>{
    const userID = req.params['userID'];

    const body = req.body;
    console.log(body);
    update(ref(db, 'users/'+userID), body);
    res.send(body);
})

app.delete('/users/:userID', requireAuth, (req, res)=>{
    const userID = req.params['userID'];
    const dataRef = ref(db, 'users/'+userID);

    set(ref(db, 'users/'+userID), null);
    res.send("User with userID: "+userID+" removed");
})