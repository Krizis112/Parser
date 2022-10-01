class Vector{
    constructor() {
        this.x = 0;
        this.y = 0;
    }
    set(x, y){
        this.x = x;
        this.y = y;
    }
    toString(){
        return "X: " + this.x + ", Y: " + this.y;
    }
}
class Player {
    constructor(id) {
        this.id = id;
        this.pos = new Vector();
    }
    setPos(x, y){
        this.pos.set(x, y);
    }
}
let boys = new Map();
let Bot = function () {
    let id = 0;
    let pos = new Vector();
    let direct;
    let ws = new WebSocket("wss://173-255-221-28.devast.io:443");
    let isLive = true;
    let players = new Map();
    ws.binaryType = 'arraybuffer';

    ws.onopen = function () {
        ws.send(JSON.stringify([30,"1243412521","12345", 123, 123 ,"Легенда вернулась!", 0 , null,0]));
    };
    ws.onmessage = function (message) {
        if(typeof message.data === "string"){
            //console.log(message.data);
        } else update(message.data);
    };
    ws.onclose = function () {
        ws =  new WebSocket("wss://173-255-221-28.devast.io:443");
    };
    function update(message) {
        let ins = new Uint8Array(message);
        switch (ins[0]) {
            case(0):
                position(ins, message);
                break;
            case(3):
                getState(ins);
                break;
            case(9):
                getID(ins);
                break;
        }
    }
    setInterval(() => {
        let target = minDistance(pos, players);
        //console.log(target);
        harassment(target);
    }, 60);
    setInterval(() => {
        if(ws.readyState === ws.OPEN) ws.send(JSON.stringify([1, "НАЦИ УЕБКИ"]))
    }, 2000);
    function position(ins, message) {
        let array = new Uint16Array(message);
        let length = (ins.length - 2) / 18;
        let count = 0;
        for(let place = 0, number = 2, stack = 1; place < length; place++, number += 18, stack += 9) {
            let socket = ins[number];
            let x = array[stack + 4];
            let y = array[stack + 5];
            if(socket === id){
                pos.set(x, y);
                //console.log(pos);
            } else if(socket > 0){
                if(boys.has(socket)){
                    console.log("FF ID: " + socket);
                } else {
                    let player = new Player(socket);
                    //console.log(k);
                    player.setPos(x, y);
                    players.set(socket, player);
                }
            }
        }
        //console.log(players.size);
    };
    function getID(ins) {
        id = ins[1];
        boys.set(id, new Player(id));
    }

    function getState(ins) {
        if((ins[1] << 8) + ins[2] === 0){

        }
    }
    boys.set(69, new Player(69));
    function harassment(player){
        direct = 0;
        //console.log(player);
        if(player.x < pos.x){
            direct |= 1;
        } else if (player.x > pos.x){
            direct |= 2;
        }
        if(player.y > pos.y){
            direct |= 4;
        } else if (player.y < pos.y){
            direct |= 8;
        }
        if(ws.readyState === ws.OPEN){
            //console.log(JSON.stringify([2, 10]));
            ws.send(JSON.stringify([2, direct]));
        }
    }
    function getPlayers(){
        return players;
    }
    return{
        id: id,
        pos: pos,
        getPlayers: getPlayers()
    }
};
let bot = new Bot();
for(let i = 0; i < 100; i++){
    Bot();
}
function remove(element, array) {
    for(let i = 0; i < array.length; i++){
        let e = array.indexOf(element);
        if(e >= 0) array.splice(i, 1);
    }
}
function minDistance(myPos, players){
    let min = 10000000;
    let player = new Vector();
    //console.log(players);
    for(let pos of players.values()){
        //console.log(pos.pos.x);
        if(dst(myPos.x, myPos.y, pos.pos.x, pos.pos.y) < min){
            min = dst(myPos.x, myPos.y, pos.pos.x, pos.pos.y);
            //console.log(min);
            player.set(pos.pos.x, pos.pos.y);
        }
    }
    return player;
}
function dst(x1, y1, x2, y2){
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}
//console.log(dst(100, 100, 200, 200));
