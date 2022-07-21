const express = require('express')
var path = require('path');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use('/publications', require('./routes/publications'));
app.use('/static', express.static(path.join(__dirname, 'public')))

const port = 3000;

app.get('/', function (req, res) {
    res.render('index', { title: 'Demo BD2!', message: 'Demo BD2!', array: [1,2,3] })
})

app.listen(port, () => console.log("DemoOracleCRUD app listening on port %s!", port))