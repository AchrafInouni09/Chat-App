const express = require ('express');
const authRoutes = require ('./src/routes/authRoutes');
const env = require ('dotenv');
const config = require ('./src/config/config');

const cors = require ('cors');

const app = express ();


app.use (cors({
    origin:'http://localhost:5173',
    credetials: true
}));

app.use (express.json ());
app.use (express.urlencoded ({extended: true}));


app.use ('/api/auth', authRoutes);


app.get ('/', (req, res) => {
    res.send('hello from local host');
})


// set up sockets ; 


app.listen (config.port, () => {
    console.log ('app listenning on ',config.port);
});







