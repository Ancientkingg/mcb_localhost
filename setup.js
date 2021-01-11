const fs = require("fs");
let LCL = "[ " + "\u001b[35mlcl\u001b[39m" + " ] "
const path = require("path");
if(process.argv.includes("-localhost")){
    fs.copyFileSync(process.env.APPDATA + "\\npm\\node_modules\\mc-build\\mcb_localhost\\config.js",path.resolve(process.cwd(), "./config.js"))
    console.log(LCL + "mcb_localhost was successfully installed into the config")
    process.exit(1);
    return null;
}