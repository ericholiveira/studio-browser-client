<a name="BrowserClient"></a>

## BrowserClient
**Kind**: global class  
**Default**: <code>{
		defaultNamespace:&#x27;__browser&#x27;,
		serviceCallEventName:&#x27;__studio_service_call&#x27;
 	}</code>  
**Access:** public  
**Author:** Erich Oliveira  
<a name="new_BrowserClient_new"></a>

### new BrowserClient(options)
Plugin for socketio browser access


| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> |  |
| options.defaultNamespace | <code>String</code> | the module name which will prepend the service automatically instantiated for browser access. Defaults to __browser |
| options.serviceCallEventName | <code>String</code> | The name of the channel used to communicate the services. Defaults to __studio_service_call |
| options.ip | <code>String</code> | Server address (format: http://SOMEADDRESS:SOMEPORT/). Defaults to socket.io default |
| options.io | <code>String</code> | socket io client object (add this if you dont want to pass ip:port) |

**Example**  
```js
Studio.use(Studio.plugin.client({ip:'http://localhost:3000/'}));
```
