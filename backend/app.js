const express = require ('express');
const authRoutes = require ('./src/routes/authRoutes');
const env = require ('dotenv');
const config = require ('./src/config/config');
const friendsRoutes = require ('./src/routes/friendsRoutes');

const cors = require ('cors');

const { auth_mw_token } = require('./src/middlewares/auth_middlware');

const app = express ();


app.use (cors({
    origin:'http://localhost:5173',
    credetials: true
}));

app.use (express.json ());
app.use (express.urlencoded ({extended: true}));


app.use ('/api/auth', authRoutes);

app.use ('/api/friends', auth_mw_token , friendsRoutes);


app.get ('/', (req, res) => {
    res.send('hello from local host');
})


// set up sockets ; 


app.listen (config.port, () => {
    console.log ('app listenning on ',config.port);
});







