// Console Interface
function log(){
    if(arguments[0]=="s"){
        arguments[0] = "\x1b[32m%s\x1b[0m";
    }
    if(arguments[0]=="f"){
        arguments[0] = "\x1b[31m%s\x1b[0m";
    }
    if(arguments[0]=="server"){
        arguments[0] = "\x1b[34m\x1b[1mServer:\x1b[0m %s\x1b[0m";
        if(arguments[1]=="user"){
            arguments[1] = "\x1b[35mUser";
            arguments[2] = "\x1b[35m\x1b[1m" + arguments[2] + "\x1b[0m";
        }
    }
    console.log.apply(console, arguments);
}

const colors = {
    blue: "\x1b[34m",
    purple: "\x1b[35m",
    reset: "\x1b[0m",
}

const os = require("os");
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
console.log();
console.log("\x1b[34m WriteNote Builder");
console.log("\x1b[34m Version: \x1b[35m" + process.env.npm_package_version);
console.log();
console.log("\x1b[34m Commands:");
console.log("\x1b[35m  Build (1)");
console.log("\x1b[35m  Status (2)");
console.log("\x1b[35m  Exit (3)");
console.log(colors.reset);

function commandInterface(){
    rl.question("", function(command) {
        if(command == "build" || command == 1){

        }
        if(command == "status" || command == 2){
            console.log(`${colors.blue}Uptime:`);
            console.log(colors.reset);
        }
        if(command == "exit" || command == 3){
            rl.close();
        }
        commandInterface();
    });
}

commandInterface();

rl.on("close", function(){
    process.exit(0);
});


function build(){
    // get folders and files
}