const express = require('express')
const app = express();
const session = require('express-session');
const port = 5000;

//untuk menerima rq.body
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

//konfigurasi session
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false
}));

//middleware untuk autentikasi
const authenticate = (req, res, next) => {
    if (req?.session.isAuthenticated) {
        next();
    } else {
        res.status(401).send('Tidak Terautentikasi');
    }
};

//route login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if ( username === 'admin' && password === 'password') {
        req.session.isAuthenticated = true;
        res.send('login sukses');
    } else {
        res.status(401).send('Kredensial tidak valid');
    }
})

//route logout
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if(err) {
            console.log(err);
        } else {
            res.send('logout');
        }
    });
});

//route get uang membutuhkan autentikasi
app.get('/protected', authenticate, (req, res) => {
    res.send('Anda masuk pada route terproteksi (GET)');
});
app.post('/protected', authenticate, (req, res) => {
    res.send('Anda masuk pada route terproteksi (POST)');
});
app.put('/protected', authenticate, (req, res) => {
    res.send('Anda masuk pada route terproteksi (PUT)');
});
app.delete('/protected', authenticate, (req, res) => {
    res.send('Anda masuk pada route terproteksi (DELETE)');
});

app.listen(port, () => {
    console.log(`server berjalan pada port ${port}`)
})