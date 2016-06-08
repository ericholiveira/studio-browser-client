var DEFAULT_NAMESPACE = '__browser';
var DEFAULT_SERVICE_CALL_EVENT_NAME = '__studio_service_call';
describe("Basic test", function() {
  it("Must expose Studio on window", function() {
    expect(window.Studio).toBeDefined();
  });
  Studio.use(Studio.plugin.client({io:{
    	emit:function(eventName,object,cb){ // mocking socketio
    		expect(typeof object).toBe('string');
    		object = JSON.parse(object);
    		expect(eventName).toBe(DEFAULT_SERVICE_CALL_EVENT_NAME);
    		expect(object.service).toBe('sayHello');
    		expect(object.params.length).toBe(1);
    		if(object.params[0]==='success'){
    			cb({response:'hello'});	
    		}else{
    			cb({error:new Error('FAIL')});	
    		}
    	}	
    }}));
  it("Must support successful messages", function(done) {
    var sayHelloService = Studio('sayHello');
    sayHelloService('success').then(function(message){
      	expect(message).toBe('hello');
      	done();
    });
  });
  it("Must support error messages", function(done) {
    var sayHelloService = Studio('sayHello');
    sayHelloService('error').then(function(message){
      	throw new Error('Must throw an error');
    }).catch(function(message){
    	expect(message.message).toBe('FAIL');
      	done();
    });
  });
});