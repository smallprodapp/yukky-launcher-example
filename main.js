let curApp = null;
let path = "";

window.api.event.on("on_versioninfos", (data) => {
    path = data.path;
    document.getElementById("folderTxt").textContent = path;
    data = data.apps;
    document.getElementById("waitserver").classList.add("disable");
    console.log(data);
    if(data.length === 0) {
        document.getElementById("noapps").classList.remove("disable");
    }else{
        let app = data[0];
        if(app.localPath){
            path = app.localPath;
        }
        curApp = app;
        if (app.canStart) {
            document.getElementById("startbut").classList.remove("disable");
        } else if (app.lastVersion === null) {
            document.getElementById("noversion").classList.remove("disable");
        } else {
            if (app.keysystem == '1' && !app.haskey) {
                document.getElementById("askkey").classList.remove('disable');
            } else {
                let dlbut = document.getElementById("dlbut");
                dlbut.classList.remove("disable");
                if(app.curVersion === null) {
                  dlbut.textContent = "Download";
                  document.getElementById("locate").classList.remove("disable");
                }else{
                    if(app.integrityIssue) {
                        dlbut.textContent = "Reinstall"
                    } else {
                        dlbut.textContent = "Update";
                    }
                }
            }
        }
    }
});

window.api.event.on("on_keyresponse", (data) => {
    // You can access the app here with data.app
    if (data.status === 'success') {
        if (app.canStart) {
            document.getElementById("startbut").classList.remove("disable");
        } else if (app.lastVersion === null) {
            document.getElementById("noversion").classList.remove("disable");
        } else {
            if (app.keysystem == '1' && !app.haskey) {

            } else {
                let dlbut = document.getElementById("dlbut");
                dlbut.classList.remove("disable");
                if(app.curVersion === null) {
                  dlbut.textContent = "Download";
                  document.getElementById("locate").classList.remove("disable");
                }else{
                    if(app.integrityIssue) {
                        dlbut.textContent = "Reinstall"
                    } else {
                        dlbut.textContent = "Update";
                    }
                }
            }
        }
    } else {
        document.getElementById("askkey").classList.remove('disable');
    }
});

window.api.event.on("on_dlstart", (data) => {
    document.getElementById("downloadProgress").classList.remove("disable");
    document.getElementById("locate").classList.add("disable");
    document.getElementById("dlbut").classList.add("disable");
});

window.api.event.on("on_dlend", (data) => {
    document.getElementById("downloadProgress").classList.add("disable");
    document.getElementById("locate").classList.add("disable");
    if(data.code === 0){
        // Error
        document.getElementById("dlbut").classList.remove("disable");
    }else{
        // Success
        document.getElementById("startbut").classList.remove("disable");
    }
});

let lastTime = null;
let lastDlSize = null;
window.api.event.on("on_dlprogress", (data) => {
    // data.size contains the total size of the file in octet
    data.size = parseInt(data.size);
    let total = "";
    if(data.size > 1000000000) {
        // Giga
        total = Number.parseFloat((data.size / 1000000000)).toFixed(2).toString() + "go";
    }else if(data.size > 1000000) {
        // Mega
        total = Number.parseFloat((data.size / 1000000)).toFixed(2).toString() + "mo";
    }else if(data.size > 1000) {
        // Kilo
        total = Number.parseFloat((data.size / 1000)).toFixed(2).toString() + "ko";
    }else {
        // Octet
        total = Number.parseFloat((data.size)).toFixed(2).toString() + "o";
    }
    let downloadedsize = data.size * data.status;
    let downloaded = "";
    if(downloadedsize > 1000000000) {
        // Giga
        downloaded = Number.parseFloat((downloadedsize / 1000000000)).toFixed(2).toString() + "go";
    }else if(downloadedsize > 1000000) {
        // Mega
        downloaded = Number.parseFloat((downloadedsize / 1000000)).toFixed(2).toString() + "mo";
    }else if(downloadedsize > 1000) {
        // Kilo
        downloaded = Number.parseFloat((downloadedsize / 1000)).toFixed(2).toString() + "ko";
    }else {
        // Octet
        downloaded = Number.parseFloat((downloadedsize)).toFixed(2).toString() + "o";
    }
    document.getElementById("bar").style.width = Math.floor(data.status * 100) + "%";
    document.getElementById("bar-percent").innerHTML = Math.floor(data.status * 100) + "%";
    document.getElementById("bar-size").textContent = downloaded + "/" + total;
    curTime = new Date();
    let speed = "";
    if(lastTime === null || lastDlSize === null) {
        speed = "-";
    }else{
        let dif = curTime.getTime() - lastTime.getTime();
        let sec = Math.abs(dif / 1000);
        let dl = downloadedsize - lastDlSize;
        let sizepersec = dl / sec;
        if(sizepersec > 1000000000) {
            // Giga
            speed = Number.parseFloat((sizepersec / 1000000000)).toFixed(2).toString() + "go";
        }else if(sizepersec > 1000000) {
            // Mega
            speed = Number.parseFloat((sizepersec / 1000000)).toFixed(2).toString() + "mo";
        }else if(sizepersec > 1000) {
            // Kilo
            speed = Number.parseFloat((sizepersec / 1000)).toFixed(2).toString() + "ko";
        }else {
            // Octet
            speed = Number.parseFloat((sizepersec)).toFixed(2).toString() + "o";
        }
    }
    document.getElementById("bar-speed").textContent = speed + "/s";
    lastTime = curTime;
    lastDlSize = downloadedsize;
});

window.onload = () => {
    document.getElementById("startbut").addEventListener("click", () => {
        if(curApp !== null) {
            window.api.sendMessage("startapp", curApp.key);
        }
    });

    document.getElementById("dlbut").addEventListener("click", () => {
        if(curApp !== null) {
            document.getElementById("dlbut").classList.add("disable");
            if(curApp.curVersion === null) {
                document.getElementById("folderselec").classList.remove("disable");
                document.getElementById("realdlbut").classList.remove("disable");
            }else{
                document.getElementById("downloadProgress").classList.remove("disable");
                document.getElementById("locate").classList.add("disable");
                window.api.sendMessage("dlapp", {key : curApp.key});
            }
        }
    });

    document.getElementById("realdlbut").addEventListener("click", () => {
        if(curApp !== null) {
            document.getElementById("realdlbut").classList.add("disable");
            document.getElementById("folderselec").classList.add("disable");
            document.getElementById("downloadProgress").classList.remove("disable");
            document.getElementById("locate").classList.add("disable");
            let path = document.getElementById("folderTxt").textContent;
            window.api.sendMessage("dlapp", {key : curApp.key, path : path});

        }
    });

    document.getElementById("keybut").addEventListener("click", () => {
        console.log('ok');
        if (curApp !== null) {
            console.log("send");
            document.getElementById("askkey").classList.add("disable");
            let key = document.getElementById('i-key').value;
            window.api.sendMessage("setkey", {appkey: curApp.key, key: key});
        }
    });
}

function selectFolder () {
    window.api.openDialog(path, onSelectFolder);
}

function onSelectFolder (res) {
    if(!res) return;
    document.getElementById("folderTxt").textContent = res[0].toString();
}

function locate () {
    window.api.openDialog(path, onLocate); 
}

function onLocate (res) {
    if(!res) return;
    window.api.sendMessage("locateapp", {key : curApp.key, path : res[0]})
}