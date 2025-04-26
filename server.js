import app from "./App.js"
import dotenv from "dotenv"

dotenv.config()

const port = process.env.APP_PORT
app.listen(port, ()=>{})