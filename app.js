import express from "express"
import config from "config"
// DB Connect 
import "./utils/dbconnect.js"

const app = express();

const PORT = config.get("PORT") || 3000;

app.get("/", async (req, res) => {
    res.send("Server started")
})

app.use(express.json());

// Error Handler
app.use((req, res, next) => {
    res.status(404).json({msg : "Route in not found"})
})

app.listen(PORT, (req, res) => {
    console.log(`Server started on ${PORT}`);
})