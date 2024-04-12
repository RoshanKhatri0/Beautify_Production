const express = require('express')
const app = express()
require('dotenv').config()
const morgan = require('morgan')
require('./db/connection')
const bodyParser=require('body-parser')
const cors = require('cors')
const path = require('path')


const beauticianProfileRoute=require('./routes/beautificanProfileRoute')
const userRoute=require('./routes/userRoute')
const adminRoute=require('./routes/adminRoutes')


//middleware
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use('/public/uploads',express.static('public/uploads'))
app.use(cors())

//routes
app.use('/api',beauticianProfileRoute)
app.use('/api',userRoute)
app.use('/api',adminRoute)

// static files
app.use(express.static(path.join(__dirname, './beautician/build')))

app.get('*', function(req,res){
    res.sendFile(path.join(__dirname, './beautician/build/index.html'))
})

const port=process.env.PORT || 5000
app.listen(port,()=>{
    console.log(`Server started on port http://localhost:${port}`)
})