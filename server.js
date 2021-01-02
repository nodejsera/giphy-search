// server.js
const http = require('http');
const path = require('path');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const hbs  = require('express-handlebars');

app.engine('hbs', hbs({
  extname: 'hbs',
  defaultLayout: 'main',
  layoutsDir: __dirname + '/views/layouts/'
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static('public')); // <-- add this 
app.get('/', (req, res) => {
    let queryString = req.query.term;
    // ENCODE THE QUERY STRING TO REMOVE WHITE SPACES AND RESTRICTED CHARACTERS
    let term = encodeURIComponent(queryString);
    // PUT THE SEARCH TERM INTO THE GIPHY API SEARCH URL
    let url = 'http://api.giphy.com/v1/gifs/search?q=' + term + '&api_key=Vi2SL110wiQilLSoiS32viqJygb4eFP3';
http.get(url, (response) => {
        // SET ENCODING OF RESPONSE TO UTF8
        response.setEncoding('utf8');
        let body = '';
        // listens for the event of the data buffer and stream
        response.on('data', (d) => {
            // CONTINUOUSLY UPDATE STREAM WITH DATA FROM GIPHY
             body += d;
        });
        // once it gets data it parses it into json 
        response.on('end', () => {
            // WHEN DATA IS FULLY RECEIVED PARSE INTO JSON
            let parsed = JSON.parse(body);
            // RENDER THE HOME TEMPLATE AND PASS THE GIF DATA IN TO THE TEMPLATE
            res.render('search-giphy', { gifs: parsed.data })
        });
    });
});

app.listen(port, () => {
  console.log('Giphy Search listening on port: ', port);
});