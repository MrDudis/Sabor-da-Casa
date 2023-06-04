import json
import websocket

token = "eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ"

def on_message(ws, message):
    message_json = json.loads(message)
    
    operation = message_json["operation"]

    if operation == "hello":
        ws.send(json.dumps({
            "operation": "identify",
            "data": { "token": token }
        }))

ws = websocket.WebSocketApp("ws://192.168.15.151:81", on_message=on_message)
ws.run_forever()