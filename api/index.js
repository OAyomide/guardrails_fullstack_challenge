const express = require('express')
const { PORT, DB_URL } = require('./src/config')
const { router } = require('./src/routes')
const { connect } = require('mongoose')
const cors = require('cors')


const app = express()
const mongooseConfig = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}

app.use(cors({
    methods: "GET, POST, PUT, DELETE, OPTIONS, PATCH",
    credentials: true,
    origin: "*"
}))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

connect(DB_URL, mongooseConfig).then(r => console.log(`DATABASE CONNECTED`)).catch(err => err)
app.use(router)
app.listen(PORT, () => {
    console.log(`API SERVER RUNNING ON PORT ${PORT}`)
})

module.exports = app