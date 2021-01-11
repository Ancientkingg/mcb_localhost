const fs = require('fs');
let dir = process.env.APPDATA + "\\npm\\node_modules\\mc-build\\mcb_localhost";
let LCL = "[ " + "\u001b[35mlcl\u001b[39m" + " ] ";
let mcbuild_dir = process.env.APPDATA + "\\npm\\node_modules\\mc-build";

fs.rmdir(dir,{recursive: true},(err)=> {
    if(err){
        console.log(LCL + "An error occurred: " + err);
    }else{
        fs.writeFileSync(mcbuild_dir + "\\cli.js","#!/usr/bin/env node\nrequire(\"./lib/core/check_for_lang_updates\");");
        console.log(LCL + "mcb_localhost was successfully uninstalled");
    }
})

