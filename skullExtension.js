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
        if(client.isConnected()) client.send(mqqtDefaultTopic,'BLINK,1');
    }

    ext.talk = function(times) {
         if(client.isConnected()) client.send(mqqtDefaultTopic,'JAW_MOTION,'+times+',1');
    }

   ext.head = function(x,y) {
         if(client.isConnected()) client.send(mqqtDefaultTopic,'SCRATCH_MOVE,'+x+','+y);
    }

    ext.send_mqtt = function(topic,msg) {
         if(client.isConnected()) client.send(topic,msg);
    }

    ext.isConnected = function(){
        if(client.isConnected()){
            return 1;
        } else {
            return 0;
        }
    }


    ext.eyes = function(eye,onoff){
        if(!client.isConnected()) return;
        var level=(onoff=="On" ? 1 :0);
        if(eye=="Both"){
            client.send(mqqtDefaultTopic,'LED,1,'+level);
            client.send(mqqtDefaultTopic,'LED,0,'+level);
        } else {
            var whichEye=(eye=="Left"?0:1);
            client.send(mqqtDefaultTopic,'LED,'+whichEye+','+level);
        }
    }

    ext.mouth = function(position,callback){
        var cmd =0;
        if(position=="Open") {
            cmd=1;
        }
        if(client.isConnected()) client.send(mqqtDefaultTopic,'JAW_POSITION,'+cmd);
        //Allow the movement to finish.. //todo add delay in the arduino code
        window.setTimeout(function() {
            callback();
        }, 500);
    }

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            [' ', 'Blink Eyes', 'blink_eyes'],
            ['w', '%m.openClose Mouth', 'mouth','Close'],
            [' ', 'Move Head to %n,%n', 'head',300,300],
            [' ', 'Talk %n times', 'talk',5],
            [' ', '%m.whichEye Eye(s) %m.onOff', 'eyes','Both','On'],
            [' ', 'MQTT topic %s message %s','send_mqtt','/scratch/sisomm','Hello, World'],
            ['r', 'Connected','isConnected'],
        ], 
        menus: {
            openClose:['Open','Close'],
            whichEye:['Both','Left','Right'],
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
        setTimeout(client.connect(),100);
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