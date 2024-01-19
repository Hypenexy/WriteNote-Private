const express = require('express');
const app = express();
const port = 3000;
const { MongoClient } = require('mongodb');
const mysql = require('mysql');
const util = require('util');

async function main(session){

    async function getUID(){
        var UID;

        var con = mysql.createConnection({
            host: "127.0.0.1",
            user: "light",
            password: "rWdaHEiAnTdSdoHOoULm",
            database: "midelight"
        });

        const query = util.promisify(con.query).bind(con);

        await con.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
            con.query("SELECT uid FROM sessions WHERE session='"+session+"'", function (err, result) {
            if (err) throw err;
                UID = result[0].uid;
            });
        });

        (async () => {
            try {
                const rows = await query("SELECT uid FROM sessions WHERE session='"+session+"'");
                console.log(rows);
                UID = rows[0].uid;
            } finally {
                con.end();
            }
        })()

        return UID;
    }

    async function connect(UID){
        const url = 'mongodb://127.0.0.1:27017';
        const client = new MongoClient(url, {
            pkFactory: { createPk: () => UID }
        });

        await client.connect();
        console.log('Connected successfully to server');

        return client;
    }

    var UID;
    function setUID(i){
        UID=i;
    }
    getUID()
    .then(function(UID){
        setUID(UID)
        connect(UID)
        .then(async function(client){
            const dbName = 'myProject';

            const db = client.db(dbName);
            const collection = db.collection('documents');

            console.log(UID);
            if(await collection.countDocuments({_id: UID}, { limit: 1 }) == 0){
                const insertResult = await collection.insertOne({a: "lolol"});
                console.log(insertResult);
            }
            
        })
        .catch(console.error);
    })
    .catch(console.error);


    //inserts multiple stuffs
    // const insertResult = await collection.insertMany([{ a: 1 }, { a: 2 }, { a: 3 }]);
    // console.log('Inserted documents =>', insertResult);

    //get specific
    // const filteredDocs = await collection.find({ a: 3 }).toArray();
    // console.log('Found documents filtered by { a: 3 } =>', filteredDocs);

    //get all
    // const findResult = await collection.find({}).toArray();
    // console.log('Found documents =>', findResult);

    //update Result
    // const updateResult = await collection.updateOne({ a: 3 }, { $set: { b: 1 } });
    // console.log('Updated documents =>', updateResult);

    //delete
    // const deleteResult = await collection.deleteMany({ a: 3 });
    // console.log('Deleted documents =>', deleteResult);
    
    //initializes index
    // const indexName = await collection.createIndex({ a: 1 });
    // console.log('index name =', indexName);

            // client.close()
    return 'done.';
}


app.get('/', (req, res) => {
    var session = ""
    var headers = req.rawHeaders;
    headers.forEach(element => {
        if(element.startsWith("PHPSESSID=")){
            session = element.slice(10)
            console.log(session);
        }
    });
    
    main(session)
        .then(console.log)
        .catch(console.error)
        .finally();
    res.send('<style>body{background:#000;color:#fff}</style>Hello World!');
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})