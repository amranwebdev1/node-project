require('dotenv').config()
const app = require('./App.js')
const port = process.env.PORT;

app.listen(port,()=>{
  console.log(`your server is running at http://localhost:${port}`)
})