import { mongoAdd, mongoGetAll, mongoUpdate, mongoDelete } from "../services/mongoServices.js";

//Todo: add error catching to all functions

export const todoGetAll = async (request, response) => {
    let { user } = request.query
    let query = {
        users: user
    }

    response.send((await mongoGetAll("toDoItems",query)));
}

export const todoPost = async (request, response) => {
    await mongoAdd("toDoItems",request.body)
    response.send("item added");
}

export const todoUpdate = async (request, response) => {
    await mongoUpdate("toDoItems",request.body)
    response.send("item updated");
}

export const todoDelete = async (request, response) => {
    await mongoDelete("toDoItems",request.body._id)
    response.send("item deleted");
}