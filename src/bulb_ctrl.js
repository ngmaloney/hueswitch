var UI = require('ui');
var Settings = require('settings');
var Ajax = require('ajax');

BulbCtrl = {};

BulbCtrl.menu = new UI.Menu();

BulbCtrl.render = function(bulb_id) {
  Settings.data("current_bulb", bulb_id);
  Ajax(
  {
    url: "http://" + Settings.data("hub_ip") + "/api/" + Settings.data("user") + "/lights/" + bulb_id,
    type: 'json'
  },
  function(data) {
    var turned_on = data.state.on;    
    var bulb_name = data.name;
    //var bulb_id = Settings.data('current_bulb');
    var item = null;
    
    if(turned_on) {
      item = {title: "Turn Off", turned_on: turned_on, id: bulb_id};
    }
    else {
      item = {title: "Turn On", turned_on: turned_on, id: bulb_id};
    }
    
    var section = {
      title: bulb_name,
      subtitle: "Power Control"
    };
    
    BulbCtrl.menu.section(0, section);
    
    BulbCtrl.menu.item(0, 0, item)
    
    BulbCtrl.menu.on('select', function(e) {
      BulbCtrl.toggle_power(e.item);
    });
    
    BulbCtrl.menu.show();
  },
  function(error) {
    console.log("Error fetching card details." + error);
  });
};

BulbCtrl.toggle_power = function(item) {
  var turn_on = !item.turned_on;
  var bulb_id = item.id;
  var state_url = "http://" + Settings.data("hub_ip") + "/api/" + Settings.data("user") + "/lights/" + bulb_id + "/state";
  Ajax(
  {
    url: state_url,
    type: 'json',
    method: 'put',
    data: {on: turn_on}
  },
  function(data) {
    if(turn_on) {
      item = {title: "Turn Off", turned_on: true, id: bulb_id};
    }
    else {
      item = {title: "Turn On", turned_on: false, id: bulb_id};
    }
    BulbCtrl.menu.item(0, 0, item);
  },
  function(error) {
    console.log("ERROR" + error);
  });
};

module.exports = BulbCtrl;