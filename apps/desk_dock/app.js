if (Bangle.getAccel().x < -0.7)
    g.setRotation(3); // assume watch in charge cradle

const yOffset = 23;
const width = g.getWidth();
const height = g.getHeight();
const centerX = g.getWidth() / 2;
const centerY = (g.getWidth()/1.2);
//const SunCalc = require("suncalc.js");
let alarms = require("Storage").readJSON("alarm.json",1)||{  hr: 'None'};
const hr = alarms.hr;
/*alarms = [
  { on : true,
    hr : 6.5, // hours + minutes/60
    msg : "Eat chocolate",
    last : 0, // last day of the month we alarmed on - so we don't alarm twice in one day!
    rp : true, // repeat
    as : false, // auto snooze
  }
];*/


// Load fonts
require("Font7x11Numeric7Seg").add(Graphics);
// Load Color
var color_clock= 0x7800;//0xF800;

function levelColor(l) {
  // no icon -> brightest green to indicate charging, even when showing percentage
  if (Bangle.isCharging()) return Arwes.C.color.success.base;
  if (l >= 50) return Arwes.C.color.success.base;
  if (l >= 15) return Arwes.C.color.secondary.dark;
  return Arwes.C.color.alert.base;
}

function drawAlarmBar() {
  const l = 10;//E.getBattery(), c = levelColor(l);
  // count = l;
  const xl = 45 + l * (194 - 46) / 100;
  g.clearRect(46, 58 + 80 + yOffset + 37+10, 193, height - 15);
  g.setColor(color_clock).fillRect(46, 58 + 80 + yOffset + 37+10, xl, height - 15);
  if (hr!='None') {
    g.drawString(hr,centerX, centerY-25 , true);//test to see if alarems are loaded
    } else {
      g.drawString("sleep well",centerX, centerY-25 , true);//alarm.hr
    }
}


const seconds = (angle) => {
  g.setColor(0, 0, 0.6);
  const pRad = Math.PI / 180;
  const faceWidth =100;
  const centerX = g.getWidth() / 2;
  const centerY = (g.getWidth()/1.01);
  const a = angle * pRad;
  const x = centerX + Math.sin(a) * faceWidth;
  const y = centerY - Math.cos(a) * faceWidth;

  // if 15 degrees, make hour marker larger
  const radius = (angle % 15) ? 2 : 4;
  g.fillCircle(x, y, radius);
};

function drawSun() {  
  const l = 1;//E.getBattery(), c = levelColor(l);
  // count = l;
  const xl = 45 + l * (194 - 46) / 100;
  const faceWidth =100;
  //const x = centerX + Math.sin(xl) * faceWidth;
  const y = centerY - Math.cos(l) * faceWidth;
  //g.clearRect(46, 8 + 80 + yOffset + 37, 193, height - 5);
  //const xs=Math.pow(xl,2);
  //const h =10;
  //const xs=Math.pow(xl-h,2);
  //const A=50.0; //guess
  //const k= 10;
  //const ys=  (A*xs) + k;//(-A*xs) + 25.0 ;
  //g.drawString("0", l, y , true);
  //g.drawString("test",150, 50 , true);
  //g.setColor(color_clock).fillRect(ys, 58 + 80 + yOffset + 37, xl, height - 5);
  for (let i = 0; i < 60; i++) {
        seconds((180 * i) / 30);
  }
}

function drawClock() {
  var d = new Date();
  var size = 6;
  var x = (g.getWidth()/2) - size*6,
      y = size+yOffset;
  g.reset();
  g.setFont("7x11Numeric7Seg",size).setFontAlign(1,-1);
  g.setColor(color_clock);
  g.drawString(d.getHours(), x, y, true);
  g.setFontAlign(-1,-1);
  if (d.getSeconds()&1) g.drawString(":", x,y);
  g.drawString(("0"+d.getMinutes()).substr(-2),x+size*4,y, true);
  // draw seconds
  g.setFont("7x11Numeric7Seg",size/2);
  g.drawString(("0"+d.getSeconds()).substr(-2),x+size*18,y + size*7, true);
  // date
  var s = d.toString().split(" ").slice(0,4).join(" ");
  g.reset().setFontAlign(0,-1);
  g.setFont("6x8",size/2.5);
  g.setColor(color_clock);
  g.drawString(s,g.getWidth()/2, y + size*12.5, true);
  // keep screen on
  //if (d.getHours()<22);
  //  g.flip();
  drawSun();
  drawAlarmBar();
}



// Clear the screen once, at startup
g.clear();
// draw immediately at first
drawClock();
var secondInterval = setInterval(drawClock, 1000);
// Stop updates when LCD is off, restart when on
Bangle.on('lcdPower',on=>{
  if (secondInterval) clearInterval(secondInterval);
  secondInterval = undefined;
  if (on) {
    secondInterval = setInterval(drawClock, 1000);
    drawClock(); // draw immediately
  }
});


// start up with charging
if (Bangle.isCharging()) {
  Bangle.on("charging", isCharging => {
    if (!isCharging) load();
  });
}

// Load widgets
Bangle.loadWidgets();
for (var w of WIDGETS) w.area="tr";//still not using the whole bar try looking up the things use in widgets??
Bangle.drawWidgets();

