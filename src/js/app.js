/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var Settings = require('settings');
var Ajax = require('ajax');
var BulbCtrl = require('bulb_ctrl');

// TODO replace with real config
// EDITME! Replace with:
//    your IP address (perhaps with port number)
//    your username
Settings.option({
  hub_ip: "10.0.0.201",
  user: "newdeveloper"
});

var card = new UI.Card({
  title: "Hue Switch",
  body: "Loading bulb list."
});

card.show();

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