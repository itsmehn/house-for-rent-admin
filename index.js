'use strict';
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require("firebase-admin");
const path = require("path")
const PORT= process.env.PORT || 8080;

const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/public', express.static('public'))
app.use(express.static('public'))

const serviceAccount = require("./key.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  
  const db = admin.firestore();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.get('/', async(req, res) => {
    try {
        const postDB = db.collection("posts");
        const users = db.collection("users");
        const response = await postDB.get();
        const responseUser = await users.get();
        let posts = [];
        let ids = [];
        let user = [];
        response.forEach(post => {
            posts.push(post.data());
            ids.push(post.id);
        });
        responseUser.forEach(u => {
            user.push(u.data());
        });
    
        res.render('home',{posts, ids, user});
    } catch (error) {
        res.send(error);
    }
})

app.put('/transfer', async(req, res) => {
    try {
        const id = req.body.id;
        const useRef = await db.collection("posts").doc(id)
        .update({
            trangthai: 1
        })
    } catch (error) {
        res.send(error);
    }
})



app.listen(PORT, () => {
    console.log('http://localhost:' + PORT);
})
