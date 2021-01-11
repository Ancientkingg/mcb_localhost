const fs = require("fs");
const path = require("path");
const { exec } = require("child_process")
let LCL = "[ " + "\u001b[35mlcl\u001b[39m" + " ] "
let repodir = process.env.APPDATA + "\\npm\\node_modules\\mc-build\\mcb_localhost\\repoDir";

if(process.argv.includes("-localhost")){
    fs.readFile(repodir, 'utf-8',(err, data)=>{
        repo = data
        let localcommit = exec("git rev-parse HEAD", {cwd: repo})
        localcommit.stdout.on('data',(data)=>{
                localcommitID = data.toString();
                let remotecommit = exec("git ls-remote https://github.com/Ancientkingg/mcb_localhost.git HEAD", {cwd: repo})
                remotecommit.stdout.on('data',(data)=>{
                    remotecommitID = data.toString();
                    if(remotecommitID != localcommitID){
                        console.log(LCL + "found an newer version of mcb localhost");
                        console.log(LCL + "automatically updating to the latest version...");
                        exec("git pull", {cwd: repo},()=>{
                            exec("npm run update", {cwd: repo},()=>{
                                console.log(LCL + "mcb localhost has finished updating");
                                fs.copyFile(process.env.APPDATA + "\\npm\\node_modules\\mc-build\\mcb_localhost\\config.js",path.resolve(process.cwd(), "./config.js"),()=>{
                                    console.log(LCL + "mcb_localhost was successfully installed into the config")
                                    process.exit(1);
                                })
                                
                            })
                        })

                    }
                })
        })
    })
    if(fs.existsSync(path.resolve(process.cwd(), "./config.json"))){
        console.log(LCL + "\u001b[31mconfig.json detected\u001b[39m")
        console.log(LCL + "\u001b[31mPlease delete your config.json and use the config.js for your variables\u001b[39m")
        process.exit(1);
    }else{
        fs.copyFileSync(process.env.APPDATA + "\\npm\\node_modules\\mc-build\\mcb_localhost\\config.js",path.resolve(process.cwd(), "./config.js"))
        console.log(LCL + "mcb_localhost was successfully installed into the config");
    }
    
}