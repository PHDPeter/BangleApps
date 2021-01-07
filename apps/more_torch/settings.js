// make sure to enclose the function in parentheses
(function(back) {
  const Storage = require("Storage");
  const filename = 'more_torch.json';
  let settings = Storage.readJSON(filename,1)|| null;
  
  //setting the defults
  function getSettings(){
    return {
      colour: 'red'
    };
  }
  
  function updateSettings() {
    require("Storage").writeJSON(filename, settings);
    Bangle.buzz();
  }
   //if no setting add the defult
  if(!settings){
    settings = getSettings();
    updateSettings();
  }
  //need for saving the setting when done
  function saveChange(name){
    return function(v){
      settings[name] = v;
      updateSettings();
    }
  }
  //this is the items in the menu.
  var colour_l = ['red', "blue"];
  const appMenu = {
    '': {'title': 'More Torch Settings'},
    "Colour " : {
      value : 0 | colour_l.indexOf(settings.colour),
      format: v => colour_l[v],
      onchange: v => {
        settings.HID = colour_l[v];
        saveChange('colour');
      }
      //min: 1, max: 10, step: 1,
      //onchange : saveChange('colour')
    },
    '< Back': back 
  };
  E.showMenu(appMenu)
})
