import app from "./App.js"
import config from "./config/config.js"

const port:Number = config.port
app.listen(port, ()=>{})