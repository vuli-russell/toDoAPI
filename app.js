import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { todoGetAll, todoPost, todoUpdate, todoDelete } from "./controllers/todoController.js";
import { Server } from "socket.io";
import http from "http";
import { mongoWatch } from "./services/mongoServices.js";

const app = express();


app.use(cors())
app.use(bodyParser.json())
//log requests to api to console
//Todo: log to a file
app.use(((request,response,next) => {
    console.log(`${(new Date).toString()} - ${request.method} at ${request.url}.\nBody: ${request.body}`)
    next();
})) 

app.get("/todo/get/", todoGetAll)

app.post("/todo/post", todoPost)

app.put("/todo/put", todoUpdate)

app.delete("/todo/delete", todoDelete)

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
    cors: {
    origin: "https://todolist.vulirussell.io/",
    methods: ["GET", "POST","PUT","DELETE"],
    }
});

//handle stuff from client
const onConnect = (socket) => {
    console.log("user connected");
    
    socket.on("disconnect", () => {
        console.log("user disconnected")
    })
}

io.on("connection", onConnect)

//push updates to client on change of toDoItems collection
mongoWatch("toDoItems",next => {
    console.log(`emmiting ${next}`)
    io.emit("toDoChange",next)
})
//ToDo: Unsubscribe?

httpServer.listen(process.env.PORT||8080)