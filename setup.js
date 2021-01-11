const fs = require("fs");
const path = require("path");
const { exec } = require("child_process")
let LCL = "[ " + "\u001b[35mlcl\u001b[39m" + " ] "
let repodir = process.env.APPDATA + "\\npm\\node_modules\\mc-build\\mcb_localhost\\repoDir";

if(process.argv.includes("-localhost")){
    fs.readFile(repodir, 'utf-8',(err, data)=>{
        output = data;
        console.log(output)
        let commit = exec("git rev-parse HEAD", {cwd: output})
        commit.stdout.on('data',(data)=>{
                commitID = data.toString();
                console.log(commitID)
                process.exit(1);
        })
    })
    if(fs.existsSync(path.resolve(process.cwd(), "./config.json"))){
        console.log(LCL + "\u001b[31mconfig.json detected\u001b[39m")
        console.log(LCL + "\u001b[31mPlease delete your config.json and use the config.js for your variables\u001b[39m")
        process.exit(1);
        return null;
    }else{
        fs.copyFileSync(process.env.APPDATA + "\\npm\\node_modules\\mc-build\\mcb_localhost\\config.js",path.resolve(process.cwd(), "./config.js"))
        console.log(LCL + "mcb_localhost was successfully installed into the config")
    }
    
}