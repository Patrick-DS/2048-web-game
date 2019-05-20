const PORT = process.env.PORT || 3000

const helmet = require('helmet')
const express = require('express')
const app = express()

app.set('views', './views')
app.set('view engine', 'pug')

app.use(helmet())
app.use(express.static('public'))


app.get('/', (req, res) => {
    res.render('index.pug')
})


app.listen(PORT)
console.log('Web Server is listening to endpoint http://0.0.0.0:' + PORT + '/');
