(function(ext) {
 
    //load MQTT library

  function loadMQTT() {
    $.getScript('http://sisomm.github.io/scratch-skull-extension/mqttws31.js')
      .done(function(script, textStatus) {
        console.log('Loaded MQTT');
      })
      .fail(function(jqxhr, settings, exception) {
        console.log('Error loading MQTT');
    });
  }
   


    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {};

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };

    ext.blink_eyes = function() {
        console.log("blink");
//        message = new Messaging.Message("BLINK,9");
  //      message.destinationName = "/arduino/1/incoming";
 //       client.send(message);
        console.log("I blank");

    };

    // Functions for block with type 'w' will get a callback function as the 
    // final argument. This should be called to indicate that the block can
    // stop waiting.
    ext.wait_random = function(callback) {

        wait = Math.random();
        console.log('Waiting for ' + wait + ' seconds');
        window.setTimeout(function() {
            callback();
        }, wait*1000);
    };

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            [' ', 'Blink Eyes', 'blink_eyes'],
            ['w', 'Mouth %m.openClose', 'wait_random'],
            ['w', 'Move Head to %n,%n', 'wait_random',300,300],
            ['w', 'Talk %n times', 'wait_random',5],
            ['w', 'Left Eye %m.onOff', 'wait_random'],
            ['w', 'Right Eye %m.onOff', 'wait_random'],
        ], 
        menus: {
            openClose:['Open','Close'],
            onOff:['On','Off']
        }
    };

    // Register the extension
    ScratchExtensions.register('Keith Richards', descriptor, ext);
    loadMQTT();

    var wsbroker = "test.mosquitto.org";  //mqtt websocket enabled broker
    var wsport = 8080 // port for above
    var client = new Messaging.Client(wsbroker, wsport,
        "myclientid_" + parseInt(Math.random() * 100, 10));
    
    client.onConnectionLost = function (responseObject) {
        console.log("connection lost: " + responseObject.errorMessage);
    };
    
    client.onMessageArrived = function (message) {
        console.log(message.destinationName, ' -- ', message.payloadString);
    };
    
    var options = {
      timeout: 3,
      onSuccess: function () {
        console.log("mqtt connected");
        // Connection succeeded; subscribe to our topic, you can add multile lines of these
        client.subscribe("/arduino/1/incoming", {qos: 1});
    
        //use the below if you want to publish to a topic on connect
        message = new Messaging.Message("Hello");
        message.destinationName = "/arduino/1/incoming";
        client.send(message);
  
      },
      onFailure: function (message) {
        console.log("Connection failed: " + message.errorMessage);
      }
    };
      

    client.connect(options);


})({});