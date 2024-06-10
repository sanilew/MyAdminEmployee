const express = require("express")
const app = express();
const port = 5000;  
const connectToMongo = require("./db")
const cors = require("cors");

connectToMongo();

app.use(express.json())
app.use(cors());

app.use('/api/auth',require("./routes/auth"));
app.use('/api/user',require("./routes/user"));

app.listen(port,() => {
    console.log(`Backend Started At Port ${port}`)
});