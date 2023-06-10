import json
import websocket
import threading

token = "eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ"

def on_message(ws, message):
    message_json = json.loads(message)
    
    operation = message_json["operation"]

    if operation == "HELLO":
        ws.send(json.dumps({
            "operation": "IDENTIFY",
            "data": { 
                "name": "Emulador Python v0.1",
                "serial": "0000-0000-0000",
                "token": token
            }
        }))

def send_actions():
    while True:
        cardId = input("Digite o ID do cartão: ")
        
        flags = [flag for flag in cardId.split() if flag.startswith("-")]
        cardId = cardId.replace(flags[0], "").strip()

        if len(cardId) == 0:
            continue

        if flags[0] == "-a":
            ws.send(json.dumps({
                "operation": "ACTION",
                "data": {
                    "cardId": cardId
                }
            }))

        if flags[0] == "-p":
            ws.send(json.dumps({
                "operation": "PAIR",
                "data": {
                    "cardId": cardId
                }
            }))

threading.Thread(target=send_actions).start()

ws = websocket.WebSocketApp("ws://192.168.15.151:8081", on_message=on_message)
ws.run_forever()

