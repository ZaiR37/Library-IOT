const express = require('express');
const app = express();
const hostPort = 3000;
const bodyParser = require('body-parser');
const { crud } = require('./mysql');
const { checkID, openPort } = require('./cardReader');

app.locals.crud = crud;
app.use(express.static(__dirname + '/views'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine','ejs');

app.get('/create', (req, res) => {
    let title = "Esa Library - Add Book";
    res.render('createForm', { title });
})

app.post('/create', (req, res) => {
    const data = req.body;
    crud('create', data, (result) => {
        console.log('Data Inserted Successfully!');
        res.redirect('/list');
    });
});

app.get('/view', (req, res) => {
    let title = "Esa Library - View Book";
    res.render('viewForm', { title })
})

app.get('/list', (req, res) => {
    let title = "Esa Library - Book List";
    crud('read', null, (books) => {
        res.render('list', {title, books});
    });
});

app.get('/list/:id', (req, res) => {
    res.send(`List Page! ${req.params.id}`)
})

app.get('/edit/:id', (req, res) => {
    let title = "Esa Library - Edit Book";
    crud('read', {id: req.params.id}, (book) => {
        res.render('editForm', { book, title });
    });
})

app.post('/delete', (req, res) => {
    crud('delete', req.body, (result) => {
        res.json(result);
    });
});

app.put('/update', (req, res) => {
    crud('update', {id: req.body.book_id, changes: req.body}, (result) => {
        res.json({ success: !!result.affectedRows });
    });
});

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

app.get('/api/data/:id', (req, res) => {
    crud('read', { id: req.params.id }, (books) => {
        res.json(books);
    });
});

app.use('/', (req, res) =>{
    res.send('ERROR 404');
});

app.listen(hostPort, () => {
  console.log(`Example app listening on port ${hostPort}`)
})