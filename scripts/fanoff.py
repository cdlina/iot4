# fanoff.py
import RPi.GPIO as GPIO
import time

# GPIO 핀 번호
FAN_PIN = 24

# GPIO 설정
GPIO.setmode(GPIO.BCM)
GPIO.setup(FAN_PIN, GPIO.OUT)

try:
    GPIO.output(FAN_PIN, GPIO.LOW)  # FAN OFF
    print("Fan turned OFF")
except Exception as e:
    print(f"Error: {e}")
finally:
    GPIO.cleanup()
