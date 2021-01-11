const Storage = require("Storage");
const filename = 'more_torch.json';
//load settings or use the defult
let settings = Storage.readJSON(filename,1) || {
  colour: 'red',
  brightness: 0.5
};
var colour =settings.colour;//'defult'
var brightness=settings.brightness;


function drawTorch(colour,brightness){
if (colour=='defult') t_colour=0xFFFF;
if(colour=='red') var t_colour=0xF800;
if(colour=='blue') var t_colour=0x001F;
//else t_colour=0xFFFF;
Bangle.setLCDPower(brightness);
Bangle.setLCDTimeout(0);//TODO check if these are set back when app turened off?
g.reset();
//change the color to one in settings
g.setColor(t_colour);
//run the torch
g.fillRect(0,0,g.getWidth(),g.getHeight());
}

// Swiping
Bangle.on("swipe",(dir)=>{
  //lower light (right???),increse light (left???)
    if (dir<0){
        brightness=0.1+brightness; if (brightness>1) brightness=1;
        drawTorch(colour,brightness);
    } else {
        brightness=0.1-brightness; if (brightness<0) brightness=0;
        drawTorch(colour,brightness);
    }  
});

// Any button turns off
setWatch(()=>load(), BTN1);
setWatch(()=>load(), BTN2);
setWatch(()=>load(), BTN3);

drawTorch(colour,brightness);
