const fs = require('fs');
let mcbuild_dir = process.env.APPDATA + "\\npm\\node_modules\\mc-build";
let dir = process.env.APPDATA + "\\npm\\node_modules\\mc-build\\mcb_localhost";
let LCL = "[ " + "\u001b[35mlcl\u001b[39m" + " ] "

if(!fs.existsSync(dir)){
    fs.mkdirSync(dir);
    fs.copyFileSync("./setup.js",dir + "\\setup.js");
    fs.copyFileSync("./config.js",dir + "\\config.js");
    fs.writeFileSync(mcbuild_dir + "\\cli.js","#!/usr/bin/env node\nrequire(\"./lib/core/check_for_lang_updates\");\nrequire(\"./mcb_localhost/setup\");");
    console.log(LCL + "the mcb_localhost was successfully installed into mc-build")
}else{
    console.log(LCL + "the mcb_localhost addon was already detected")
    console.log(LCL + "Please remove the mcb_localhost folder or type npm remove if you want to reinstall mcb_localhost")
    console.log(LCL + "The folder can be found in " + dir)
}

