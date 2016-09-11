/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var Settings = require('settings');
var Clay = require('./clay');  // NOTE From Clay readme, Pebble.js does not currently support message keys so you will have to use v0.1.7 of Clay
var clayConfig = require('./config');
var clay = new Clay(clayConfig, null, {autoHandleEvents: false});
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


function GetSwitchList()
{
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
}

Pebble.addEventListener('showConfiguration', function(e) {
  Pebble.openURL(clay.generateUrl());
});

Pebble.addEventListener('webviewclosed', function(e) {
  if (e && !e.response) {
    return;
  }
  var dict = clay.getSettings(e.response);
    console.log('e.response: ' + e.response);
    console.log('e.response.length: ' + e.response.length);
    console.log('dictionary to validate ' + JSON.stringify(dict));

  // Save the Clay settings to the Settings module. 
  Settings.option(dict);

  // Connect and get switch/light information
  GetSwitchList();
});

var card = new UI.Card({
  title: "Hue Switch",
  body: "Loading bulb list."
});

card.show();
