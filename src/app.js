/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var Settings = require('settings');
var Ajax = require('ajax');
var BulbCtrl = require('bulb_ctrl');

Settings.option({
  hub_ip: "10.0.0.201",
  user: "newdeveloper"
});

Ajax(
  {
    url: "http://" + Settings.option("hub_ip") + "/api/" + Settings.option("user") + "/lights",
    type: 'json'
  },
  function(data) {
    var items = [];
    
    for(var i in data) {
      items.push({title: data[i].name, id: i});
    }
    
    var menu = new UI.Menu({
      sections: [{
        title: "Bulb Selection",
        items: items
      }]
    });
    
    menu.on('select', function(e) {
      BulbCtrl.render(e.item.id); 
    });
    
    menu.show();
  },
  function(error) {
    console.log("ERROR: " + error);
  }
);