const Storage = require("Storage");
const filename = 'more_torch.json';
//load settings or use the defult
let settings = Storage.readJSON(filename,1) || {
  colour: 'red',
  brightness: 0.5
};
var colour =settings.colour;//'defult'
var brightness=settings.brightness;

var list_avalible_colour=['defult','red','blue','navy'.'DarkGreen','DarkCyan'];
var ci=0


function drawTorch(colour,brightness){
if (colour=='defult') var t_colour=0xFFFF;
if(colour=='red') var t_colour=0xF800;
if(colour=='blue') var t_colour=0x001F;
if(colour=='navy') var t_colour=0x000F;
if(colour=='DarkGreen') var t_colour=0x03E0;
if(colour=='DarkCyan') var t_colour=0x03EF;
if(colour=='Maroon') var t_colour=0x7800;
if(colour=='Purple') var t_colour=0x780F;
if(colour=='Olive') var t_colour=0x7BE0;
if(colour=='LightGray') var t_colour=0xC618;
if(colour=='Green') var t_colour=0x07E0;
if(colour=='Cyan') var t_colour=0x07FF;
if(colour=='Magenta') var t_colour=0xF81F;
if(colour=='Yellow') var t_colour=0xFFE0;
if(colour=='Orange') var t_colour=0xFD20;
if(colour=='GreenYellow') var t_colour=0xAFE5;
if(colour=='Pink') var t_colour=0xF81F;

//else t_colour=0xFFFF;
Bangle.setLCDPower(brightness);
Bangle.setLCDTimeout(0);//TODO check if these are set back when app turened off?
g.reset();
//change the color to one in settings
g.setColor(t_colour);
//run the torch
g.fillRect(0,0,g.getWidth(),g.getHeight());
}

function change_colour(){
  if(ci>list_avalible_colour.length) {
    ci=0
  };
  colour=list_avalible_colour[ci]
  drawTorch(colour,brightness)
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
setWatch(()=>change_colour(), BTN1);
setWatch(()=>load(), BTN2);
setWatch(()=>load(), BTN3);

drawTorch(colour,brightness);
