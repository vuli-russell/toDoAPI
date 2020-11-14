import mongodb from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PW}@cluster0.rgfge.mongodb.net?retryWrites=true&w=majority`;

const mongoClient = mongodb.MongoClient;

//Todo: add error catching to all functions

//adds document to given collection
export const mongoAdd = async (collectionName,document) => {
    const client = await mongoClient.connect(uri, { useUnifiedTopology: true });
    document._id = new mongodb.ObjectID().toString();
    await client.db("VuliToDoList").collection(collectionName).insertOne(document);
    await client.close();
}

//gets all items in collection
export const mongoGetAll = async (collectionName,query) => {
    let documentsArr;
    const client = await mongoClient.connect(uri, { useUnifiedTopology: true });
    documentsArr = await client.db("VuliToDoList").collection(collectionName).find(query).toArray();
    await client.close()
    return documentsArr;
}

//updates collection with updated document, filtering by _id/
//will update the document matching the _id on document, with any other firled included on document argument
//only fields whuich were updated need to be included on the argument document
export const mongoUpdate = async (collectionName,document) => {
    const client = await mongoClient.connect(uri, { useUnifiedTopology: true });
    await client.db("VuliToDoList").collection(collectionName).updateOne({_id : document._id},{$set:{...document}},{upsert: false});
}

export const mongoDelete = async (collectionName,_id) => {
    const client = await mongoClient.connect(uri, { useUnifiedTopology: true });
    await client.db("VuliToDoList").collection(collectionName).deleteOne({_id:_id})
    await client.close()
}

export const mongoWatch = async (collectionName, handleChange) => {
    const client = await mongoClient.connect(uri, { useUnifiedTopology: true });
    const changeStream = client.db("VuliToDoList").collection(collectionName).watch();
    changeStream.on("change", handleChange)
    // await client.close()
}

