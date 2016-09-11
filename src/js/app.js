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

var loading_card = new UI.Card({
  title: "Hue Switch",
  body: "Loading bulb list."
});

var need_config_card = new UI.Card({
  title: "Hue Switch",
  body: "Set config on Phone."
});


function GetSwitchList()
{
    need_config_card.hide();
    loading_card.show();

    // TODO CloudPebble emulation test data/service?
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
        
        loading_card.hide();
        menu.show();
      },
      function(error) {
        // TODO show something on watch
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

console.log('ip: ' + Settings.option("hub_ip"));
if (Settings.option("hub_ip"))
{
    console.log('have ip');
    GetSwitchList();
}
else
{
    console.log('need ip');
    need_config_card.show();
}
