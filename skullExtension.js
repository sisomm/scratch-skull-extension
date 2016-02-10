(function(ext) {
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
            ['w', 'Blink Eyes', 'wait_random'],
            ['w', 'Mouth m.openClose', 'wait_random'],
            ['w', 'Move Head to %n,%n', 'wait_random',300,300],
            ['w', 'Talk %n times', 'wait_random',5],
            ['w', 'Left Eye %m.onOff', 'wait_random'],
            ['w', 'Right Eye %m.onOff', 'wait_random'],
        ], 
        menus: {
            mopenClose:['Open','Close'],
            onOff:['On','Off']
        }
    };

    // Register the extension
    ScratchExtensions.register('Keith Richards', descriptor, ext);
})({});