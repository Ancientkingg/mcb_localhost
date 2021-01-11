//generated config

module.exports = mcb_localhost({
  mc: {
    dev: false,
    header: "#built using mc-build (https://github.com/mc-build/mc-build)",
    internalScoreboard: "LANG_MC_INTERNAL",
    rootNamespace: null,
  },
  global: {},
});












const fs = require("fs")
const https = require("https")
const { spawn } = require("child_process")
const { exec } = require("child_process")
const path = require("path")
const perf = require('perf_hooks')
const { cpuUsage } = require("process")
let url = "https://launcher.mojang.com/v1/objects/35139deedbd5182953cf1caa23835da59ca3d7cd/server.jar"
let dir = "./.mcproject/mcb_localhost"
var server
let LCL = "[ " + "\u001b[35mlcl\u001b[39m" + " ] "
const { lstatSync, readdirSync } = require('fs')
const { join } = require('path')


const isDirectory = source => lstatSync(source).isDirectory()
const getDirectories = source =>
  readdirSync(source).map(name => join(source, name)).filter(isDirectory)

let datapacks = getDirectories(path.resolve(path.join(process.cwd(),"..")))




if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir)
}

function serverStart() {
  for(i = 0; i < datapacks.length; i++){
    fs.rmdirSync(dir + `/world/datapacks/generic_datapack_${i}/data`, {recursive: true})
  }
  server = spawn("java", ["-Xmx1024M", "-Xms1024M", "-jar", "server.jar", "nogui"], { cwd: "./" + dir + "/" })
  process.stdin.pipe(server.stdin)
  server.stdout.once('data', () => {
    console.log(LCL + "the localhost is starting up...")
    let local_start = perf.performance.now()
    server.stdout.on("data", (data) => {
      serverOutput = data.toString();
      // console.log(LCL + serverOutput)
      if(serverOutput.includes("/ERROR")){
        console.log(LCL + "\u001b[31m" + serverOutput.split("at java")[0].replace("java.util.concurrent.CompletionException: java.lang.IllegalArgumentException:", "").split("ERROR]: ")[1].replace("\r\n ", ": " ).replace(" Incorrect argument for command at","") + "\u001b[39m");
      }
      if (serverOutput.includes("Done")) {
        let local_end = perf.performance.now()
        console.log(LCL + "the localhost has successfully started in " + (local_end - local_start).toFixed(3) + " ms")
        for(i = 0; i < datapacks.length; i++){
          if(fs.existsSync(datapacks[i] + '\\pack.mcmeta')){
            if (!fs.existsSync(dir + `/world/datapacks/generic_datapack_${i}`)) {
              fs.mkdirSync(dir + `/world/datapacks/generic_datapack_${i}`)
            }
            exec("xcopy /e /i /y \"" + datapacks[i] + "/data\" \"" + dir + `/world/datapacks/generic_datapack_${i}/data\"`, (err)=>{});
            fs.copyFileSync(datapacks[i] + '\\pack.mcmeta', dir + `/world/datapacks/generic_datapack_${i}/pack.mcmeta`,0 ,()=>{})
          }
        }
        
        server.stdin.setEncoding('utf-8');
        server.stdin.write("reload\n")
      }
    })
  })
}

if (!fs.existsSync("./.mcproject/mcb_localhost/server.jar")) {
  console.log(LCL + "no server.jar detected")
  console.log(LCL + "downloading server.jar...")
  let request = https.get(url);
  request.on("response", function (response) {
    response.pipe(fs.createWriteStream("./" + dir + "/server.jar"))
    response.on("end", function () {
      fs.writeFileSync("./" + dir + "/eula.txt", "eula=true", (err) => { })
      fs.writeFileSync(
        "./" + dir + "/server.properties",
        "spawn-protection=16\nmax-tick-time=60000\nquery.port=25565\ngenerator-settings=\nsync-chunk-writes=true\nforce-gamemode=false\nallow-nether=true\nenforce-whitelist=false\ngamemode=creative\nbroadcast-console-to-ops=true\nenable-query=false\nplayer-idle-timeout=0\ntext-filtering-config=\ndifficulty=easy\nspawn-monsters=true\nbroadcast-rcon-to-ops=true\nop-permission-level=4\npvp=true\nentity-broadcast-range-percentage=100\nsnooper-enabled=true\nlevel-type=flat\nhardcore=false\nenable-status=true\nenable-command-block=true\nmax-players=20\nnetwork-compression-threshold=256\nresource-pack-sha1=\nmax-world-size=29999984\nfunction-permission-level=2\nrcon.port=25575\nserver-port=25565\nserver-ip=\nspawn-npcs=true\nallow-flight=false\nlevel-name=world\nview-distance=10\nresource-pack=\nspawn-animals=true\nwhite-list=false\nrcon.password=\ngenerate-structures=true\nonline-mode=true\nmax-build-height=256\nlevel-seed=\nprevent-proxy-connections=false\nuse-native-transport=true\nenable-jmx-monitoring=false\nmotd=A Minecraft Server\nrate-limit=0\nenable-rcon=false\n",
        (err) => { }
      );
      serverStart()
    })
  })
} else {
  serverStart()
}

let count = 0;

function serverReload(){
  count += 1;
  if(count > 0){
    for(i = 0; i < datapacks.length; i++){
      fs.rmdirSync(dir + `/world/datapacks/generic_datapack_${i}/data`, {recursive: true})
    }
            for(i = 0; i < datapacks.length; i++){
              if(fs.existsSync(datapacks[i] + '\\pack.mcmeta')){
                if (!fs.existsSync(dir + `/world/datapacks/generic_datapack_${i}`)) {
                  fs.mkdirSync(dir + `/world/datapacks/generic_datapack_${i}`)
                }
                exec("xcopy /e /i /y \"" + datapacks[i] + "/data\" \"" + dir + `/world/datapacks/generic_datapack_${i}/data\"`, (err)=>{
                  fs.copyFile(datapacks[i] + '\\pack.mcmeta', dir + `/world/datapacks/generic_datapack_${i}/pack.mcmeta`,0,()=>{
                    server.stdin.setEncoding('utf-8');
                    server.stdin.write("reload\n")
                  })
                });
              }
            }
            
  }
}

function mcb_localhost(config) {
  config.global.onBuildSuccess = serverReload
  return config;
}
