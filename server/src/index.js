import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import app from "./app.js"
import "./config/dns.js";

// dns.setServers(["8.8.8.8", "8.8.4.4"]);
dotenv.config({ path: "./.env" })

const port = 3001

connectDB()
.then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`)
    })
}).catch((err) => {
    console.log("MongoDB connection failed!", err)
})


