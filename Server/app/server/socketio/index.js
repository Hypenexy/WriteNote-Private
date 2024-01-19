var http, server

var isWin = process.platform === "win32";
if(!isWin){
    const fs = require('fs')
    options = {
        key: fs.readFileSync('/etc/apache2/sites-enabled/midelight.net.key'),
        cert: fs.readFileSync('/etc/apache2/sites-enabled/midelight.net.pem')
    }
    http = require('https');
    server = http.createServer(options);
}
else{
    http = require('http');
    server = http.createServer();
}

const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        // origin: "http://192.168.1.11",
        credentials: true
    }
});

const { MongoClient } = require('mongodb');
const mysql = require('mysql');

const {instrument} = require("@socket.io/admin-ui")
instrument(io, {auth: false})

const tesseract = require("node-tesseract-ocr")

const config = {
  lang: "eng",
  oem: 1,
  psm: 3,
}

//on server start you could
//delete all active devices
//another collection for devices will be cool

//https://socket.io/how-to/use-with-express-session

io.on('connection', (socket) => {
    console.log('a user connected')
    
    socket.on("ping", (callback) => {
        callback();
    })

    socket.on('contentChange', (data) => {
        console.log(data)
        socket.broadcast.emit('contentChange', data)
    })
    socket.on('logon', (data) => {
        if(data.startsWith("PHPSESSID=")){
            var session = data.slice(10, 58)

            var UID;

            var con = mysql.createConnection({
                host: "127.0.0.1",
                user: "light",
                password: "rWdaHEiAnTdSdoHOoULm",
                database: "midelight"
            });

            con.connect(function(err) {
                if (err) throw err;
                    con.query("SELECT uid FROM sessions WHERE session='"+session+"'", function (err, result) {
                if (err) throw err;
                    if(result[0]){
                        UID = result[0].uid;

                        const url = 'mongodb://127.0.0.1:27017';
                        const client = new MongoClient(url, {
                            pkFactory: { createPk: () => UID }
                        });
    
                        client.connect();
                        const dbName = 'myProject';
    
                        const db = client.db(dbName);
                        const collection = db.collection('documents');

                        socket.join(UID)
                        var ua = socket.request.headers['user-agent']
                        socket.broadcast.to(UID).emit("logon", [socket.id, ua]);


                        async function getDocs() {
                            try {
                                coll = await client.db('myProject').collection('documents')
                                cursor = await coll.find({_id: UID}, {projection: { devices: true, _id: false }})
                                return cursor.toArray()
                            } catch (e) {
                                console.error('Error:', e)
                            }
                        };

                        (async function() {
                            let docsList = await getDocs()
                            docsList[0].you = socket.id
                            socket.emit("getOtherDevices", docsList[0])
                        })();
                        

                        async function updateRoom(isAdd){
                            if(isAdd==true){
                                const updateResult = await collection.updateOne({}, { $push: { devices: [socket.id, ua] } });
                                // console.log('Updated documents =>', updateResult);
                            }
                            else{
                                const updateResult = await collection.updateOne({}, { $pull: { devices : [socket.id, ua] } });
                                // console.log('Updated documents =>', updateResult);
                            }
                        }
                        updateRoom(true)
                        socket.on('disconnect', () => {
                            updateRoom(false).then(function(){
                                socket.broadcast.to(UID).emit("logout", socket.id);
                                client.close();
                            })
                        })

                        // console.log(UID);
                        async function checkMongoSet(){
                            if(await collection.countDocuments({_id: UID}, { limit: 1 }) == 0){
                                const insertResult = await collection.insertOne({files : ""});
                                console.log(insertResult);
                            }
                        }
                        checkMongoSet()
                    }
                });
            });
        }
    })
    socket.on('img2text', (data) => {
        tesseract
        .recognize(data, config)
        .then((text) => {
            socket.emit("img2text", text)
        })
        .catch((error) => {
            socket.emit("img2text", error.message)
        })
      
    })
    socket.on('disconnect', () => {
        console.log('user disconnected')
    });
});

server.listen(2053, () => {
    console.log('listening on *:2053')
});