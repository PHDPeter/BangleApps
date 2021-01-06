var deviceInfo = {};
if (Bangle.getAccel().x < -0.7)
    g.setRotation(3); // assume watch in charge cradle
// Tile sizes
var TILESIZE = 60;
// Tiles along width of screen
var TILEX = 4;

g.clear();

// Load fonts
require("Font7x11Numeric7Seg").add(Graphics);

function drawClock() {
  var d = new Date();
  var size = 3;
  var x = (g.getWidth()/2) - size*6,
      y = size;
  g.reset();
  g.setFont("7x11Numeric7Seg",size).setFontAlign(1,-1);
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
  g.drawString(s,g.getWidth()/2, y + size*12, true);
  // keep screen on
  g.flip();
}

setInterval(drawClock, 1000);
drawClock();

if (Bangle.isCharging()) {
  Bangle.on("charging", isCharging => {
    if (!isCharging) load();
  });
}
