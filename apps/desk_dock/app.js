if (Bangle.getAccel().x < -0.7)
    g.setRotation(3); // assume watch in charge cradle

const yOffset = 23;
const width = g.getWidth();
const height = g.getHeight();
const centerX = g.getWidth() / 2;
const centerY = (g.getWidth()/1.2);
//const SunCalc = require("suncalc.js");
let alarms = require("Storage").readJSON("alarm.json",1)||{  hr: 6.5};
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

// lat Latitude of location (South is negative)
// lng Longitude of location (West is negative)
// tz Timezone hour offset. e.g. Pacific/Los Angeles is -8 (Optional, defaults to system timezone)
const tz= -8;
function suntimes(lat, lng, tz) {
    var d = new Date();
    var radians = Math.PI / 180.0;
    var degrees = 180.0 / Math.PI;

    var a = Math.floor((14 - (d.getMonth() + 1.0)) / 12);
    var y = d.getFullYear() + 4800 - a;
    var m = (d.getMonth() + 1) + 12 * a - 3;
    var j_day = d.getDate() + Math.floor((153 * m + 2)/5) + 365 * y + Math.floor(y/4) - Math.floor(y/100) + Math.floor(y/400) - 32045;
    var n_star = j_day - 2451545.0009 - lng / 360.0;
    var n = Math.floor(n_star + 0.5);
    var solar_noon = 2451545.0009 - lng / 360.0 + n;
    var M = 356.0470 + 0.9856002585 * n;
    var C = 1.9148 * Math.sin( M * radians ) + 0.02 * Math.sin( 2 * M * radians ) + 0.0003 * Math.sin( 3 * M * radians );
    var L = ( M + 102.9372 + C + 180 ) % 360;
    var j_transit = solar_noon + 0.0053 * Math.sin( M * radians) - 0.0069 * Math.sin( 2 * L * radians );
    var D = Math.asin( Math.sin( L * radians ) * Math.sin( 23.45 * radians ) ) * degrees;
    var cos_omega = ( Math.sin(-0.83 * radians) - Math.sin( lat * radians ) * Math.sin( D * radians ) ) / ( Math.cos( lat * radians ) * Math.cos( D * radians ) );

    // sun never rises
    if( cos_omega > 1)
      return [null, -1];

    // sun never sets
    if( cos_omega < -1 )
      return [-1, null];

    // get Julian dates of sunrise/sunset
    var omega = Math.acos( cos_omega ) * degrees;
    var j_set = j_transit + omega / 360.0;
    var j_rise = j_transit - omega / 360.0;

    /*
    * get sunrise and sunset times in UTC
    * Check section "Finding Julian date given Julian day number and time of
    *  day" on wikipedia for where the extra "+ 12" comes from.
    */
    var utc_time_set = 24 * (j_set - j_day) + 12;
    var utc_time_rise = 24 * (j_rise - j_day) + 12;
    var tz_offset = tz === undefined ? -1 * d.getTimezoneOffset() / 60 : tz;
    var local_rise = (utc_time_rise + tz_offset) % 24;
    var local_set = (utc_time_set + tz_offset) % 24;
    return [local_rise, local_set];
}


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

function time_till(hr,min){
  var d = new Date();
  t_hr= (hr-d.getHours());
  t_min=(min-d.getMinutes());
  return [t_hr,t_min];
}

function isoToObj(s) {
    var b = s.split(/[-TZ:]/i);

    return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5]));
}

function timeToGo(hr,min) {

    // Utility to add leading zero
    function z(n) {
      return (n < 10? '0' : '') + n;
    }

    // Convert string to date object
    var current = new Date();
    var d = new Date(Date.UTC(current[0], --current[1], current[2], current[3], hr, min));//isoToObj(s);
    var diff = d - current;

    // Allow for previous times
    var sign = diff < 0? '-' : '';
    diff = Math.abs(diff);

    // Get time components
    var hours = diff/3.6e6 | 0;
    var mins  = diff%3.6e6 / 6e4 | 0;
    var secs  = Math.round(diff%6e4 / 1e3);

    // Return formatted string
    return [hours,mins,secs];//sign + z(hours) + ':' + z(mins) + ':' + z(secs);   
}

function convert_range(a){
  const OldMax =24;
  const OldMin =0;
  const NewMax = 100;
  const NewMin = 0;
  const OldRange = (OldMax - OldMin);
  const NewRange = (NewMax - NewMin); 
  b= (((a - OldMin) * NewRange) / OldRange) + NewMin;
 return b;
}

function drawAlarmBar() {
  var a_hrs = 0|hr;
  var a_mins = Math.round((hr-a_hrs)*60);
  till_list=time_till(a_hrs,a_mins);
  //till_list=timeToGo(a_hrs,a_mins);
  time_covert=till_list[0]+(till_list[1]/60);// hours + minutes/60
  b=convert_range(time_covert);
  var c_hrs = 0|till_list[0];
  var c_mins = Math.round((till_list[0]-c_hrs)*60);
  const l = Math.abs(b);//E.getBattery(), c = levelColor(l);
  g.setFont("7x11Numeric7Seg",2/2);
  // count = l;
  const xl = 45 + l * (194 - 46) / 100;
  g.clearRect(46, 58 + 80 + yOffset + 37+10, 193, height - 15);
  g.setColor(color_clock).fillRect(46, 58 + 80 + yOffset + 37+10, xl, height - 15);
  if (hr!='None') {
    g.drawString(new Date(),centerX, centerY-28 , true);//test to see if alarems are loaded
    } else {
      g.drawString("sleep well",centerX, centerY-28 , true);//alarm.hr
    }
}


const seconds = (angle,radius) => {
  //g.setColor(0, 0, 0.6);
  const pRad = Math.PI / 180;
  const faceWidth =100;
  const centerX = g.getWidth() / 2;
  const centerY = (g.getWidth()/1.01);//1.01
  const a = angle * pRad;
  const x = centerX + Math.sin(a) * faceWidth;
  const y = centerY - Math.cos(a) * faceWidth;

  // if 15 degrees, make hour marker larger
  //const radius = (angle % 15) ? 2 : 4;
  g.fillCircle(x, y, radius);
};

function drawSun() {  
  const l = 1;//E.getBattery(), c = levelColor(l);
  // count = l;
  const xl = 45 + l * (194 - 46) / 100;
  const faceWidth =100;
  //const x = centerX + Math.sin(xl) * faceWidth;
  const y = centerY - Math.cos(l) * faceWidth;
  const radius= 2;
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
  const lat=0;
  const lng=0;
  
  rise_set=suntimes(lat, lng, tz);
  
  
  
  for (let i = 0; i < 30; i++) {
        if (i==10){g.setColor(0xC618);
                  const radius = 4;}
    else{g.setColor(0, 0, 0.6);
        const radius = 2;}
        seconds((180 * i) / 30 -90,radius);// -90 make it start at the left hand side,180 to only do 1/2 circal
  }
  //time till nightfall (- if alredy night)
  g.setColor(0xC618);
  g.drawString("-00", 30, 135 , true);
  //time till sunrise (- if alredy up)
  g.setColor(0xFD20);
  g.drawString("-00", 218, 135 , true);
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
