const Storage = require("Storage");
const filename = 'more_torch.json';
//load settings or use the defult
let settings = Storage.readJSON(filename,1) || {
  colour: 'green'
};
const colour ='defult'
if (colour=='defult') t_colour=0xFFFF;

function drawTorch(colour){
if(settings.colour=='red') var t_colour=0xF800;
if(settings.colour=='blue') var t_colour=0x001F;
//else t_colour=0xFFFF;
Bangle.setLCDPower(1);
Bangle.setLCDTimeout(0);//TODO check if these are set back when app turened off?
g.reset();
//change the color to one in settings
g.setColor(t_colour);
//run the torch
g.fillRect(0,0,g.getWidth(),g.getHeight());
}

// Swiping
Bangle.on("swipe",(dir)=>{
    selected = 0;
    oldselected=-1;
    if (dir<0){
        ++page; if (page>maxPage) page=maxPage;
        #drawPage(page);
    } else {
        --page; if (page<0) page=0;
        #drawPage(page);
    }  
});

// Any button turns off
setWatch(()=>load(), BTN1);
setWatch(()=>load(), BTN2);
setWatch(()=>load(), BTN3);
