const express = require('express');
const app = express();
const hostPort = 3000;
const bodyParser = require('body-parser');
const { crud } = require('./mysql');
const { checkID, openPort } = require('./cardReader');

app.locals.crud = crud;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine','ejs');

app.get('/create', (req, res) => {
    res.render('createForm');
})

app.post('/create', (req, res) => {
    const data = req.body;
    crud('create', data, (result) => {
        console.log('Data Inserted Successfully!');
        // Redirect the user to the '/list' page
        res.redirect('/list');
    });
});

app.get('/book/:id', (req, res) => {
    res.send(`Book Details Page! ${req.params.id}`)
})

app.get('/list', (req, res) => {
    crud('read', null, (books) => {
        res.render('list', { books });
    });
});

app.get('/list/:id', (req, res) => {
    res.send(`List Page! ${req.params.id}`)
})

app.get('/edit/:id', (req, res) => {
    res.send(`Edit Page data number ${req.params.id}`)
})

app.get('/api/id_card', (req, res) => {
    openPort();
    checkID()
    .then((data) => {
        let id = { id: data };
        res.json(id);
    })
    .catch((err) => {
        console.log(err);
        res.sendStatus(500);
    });
});

app.post('/delete', (req, res) => {
    crud('delete', req.body, (result) => {
        res.json(result);
    });
});

app.use('/', (req, res) =>{
    res.send('ERROR 404');
});

app.listen(hostPort, () => {
  console.log(`Example app listening on port ${hostPort}`)
})