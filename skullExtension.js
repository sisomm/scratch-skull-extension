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

    // Functions for block with type 'w' will get a callback function as the 
    // final argument. This should be called to indicate that the block can
    // stop waiting.

    ext.blink_eyes = function() {
        var message = new Paho.MQTT.Message('BLINK,9');
        message.destinationName = mqqtDefaultTopic;
        //client.send(message);
        client.send(mqqtDefaultTopic,'BLINK,9');
    }

    ext.send_mqtt = function(topic,msg) {
        console.log("send"+topic+":"+msg);
        var message = new Paho.MQTT.Message(msg);
        message.destinationName = topic;
        //client.send(message);
        client.send(topic,msg);
    }


    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            [' ', 'Blink Eyes', 'blink_eyes'],
            [' ', 'Mouth %m.openClose', 'wait_random'],
            [' ', 'Move Head to %n,%n', 'wait_random',300,300],
            [' ', 'Talk %n times', 'wait_random',5],
            [' ', '%m.whichEye Eye %m.onOff', 'wait_random'],
            [' ', 'MQTT topic %s message %s','send_mqtt','/scratch/sisomm','Hello, World'],
        ], 
        menus: {
            openClose:['Open','Close'],
            whichEye:['Left','Right'],
            onOff:['On','Off']
        }
    };

    // Register the extension
    ScratchExtensions.register('Keith Richards', descriptor, ext);
    loadMQTT();

    var wsbroker = "test.mosquitto.org";  //mqtt websocket enabled broker
    var wsport = 8080 // port for above
    var client = new Paho.MQTT.Client(wsbroker, wsport,
        "myclientid_" + parseInt(Math.random() * 100, 10));
    var mqqtDefaultTopic="/scratch/sisomm";
    
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
        client.subscribe("/scratch/sisomm/#", {qos: 1});
    
        //use the below if you want to publish to a topic on connect
        message = new Paho.MQTT.Message('Hello');
        message.destinationName = "/scratch/sisomm";
        client.send(message);
  
      },
      onFailure: function (message) {
        console.log("Connection failed: " + message.errorMessage);
      }
    };
      

    client.connect(options);


})({});