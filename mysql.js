const mysql = require('mysql');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
  });
  
connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to the MySQL server.');
  });
  
const createTable = `CREATE TABLE IF NOT EXISTS books (
    book_id INT NOT NULL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    publisher VARCHAR(255) NOT NULL,
    year_published INT NOT NULL
)`;
  
connection.query(createTable, (err, result) => {
    if (err) throw err;
    console.log('Table created successfully.');
});
  
const crud = (type, data, cb) => {
    switch(type) {
        case 'create':
        connection.query(`INSERT INTO books SET ?`, data, (err, result) => {
            if (err) throw err;
            cb(result);
        });
        break;

        case 'read':
            if(data){
              connection.query('SELECT * FROM books WHERE book_id = ?', data.id, (err, books) => {
                if (err) throw err;
                if(books.length > 0){
                  cb(books);
                }else{
                  console.log(`Error: No book found with id ${data.id}`);
                }
              });
            }else{
              connection.query('SELECT * FROM books', (err, books) => {
                if (err) throw err;
                cb(books);
              });
            }
        break;

        case 'update':
        connection.query(`UPDATE books SET ? WHERE book_id = ?`, [data.changes, data.id], (err, result) => {
            if (err) throw err;
            cb(result);
        });
        break;

        case 'delete':
        connection.query(`DELETE FROM books WHERE book_id = ?`, data.id, (err, result) => {
            if (err) throw err;
            cb(result);
        });
        break;

        default:
        console.log('Invalid type');
    }
}

module.exports = { crud };

  
//Create data
// crud('create', { book_id: '2', title: 'Book Title', category: 'Fiction', author: 'John Doe', publisher: 'Publisher', year_published: 2020 }, (result) => {
//     console.log(result);
// });

//Read all details for all data
// crud('read', null, (books) => {
//     console.log(books);
// });

//Read all the details for spesific data
// crud('read', { id: 1 }, (books) => {
//     console.log(books);
// });

//Read spesific detail about spesific data
// crud('read', { id: 1 }, (books) => {
//     const titles = books.map(book => book.title);
//     console.log(titles);
// });

//Update the data
// crud('update', { id: 1, changes: { title: 'New Title' } }, (result) => {
//     console.log(result);
// });

//Delete spesific data
// crud('delete', { id: 1 }, (result) => {
//     console.log(result);
// });