import dht11
import RPi.GPIO as GPIO
import time
import json

# DHT11 센서 GPIO 핀 설정
GPIO.setmode(GPIO.BCM)
sensor = dht11.DHT11(pin=4)

# 센서 읽기
result = sensor.read()

# 센서 읽기 결과
if result.is_valid():
    data = {
        "temperature": result.temperature,
        "humidity": result.humidity
    }
else:
    data = {
        "temperature": "Error",
        "humidity": "Error"
    }

# 결과를 JSON 형식으로 출력
print(json.dumps(data))

# GPIO 리소스 정리
GPIO.cleanup()