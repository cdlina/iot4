#ledon.py
import RPi.GPIO as GPIO
import time

# GPIO 핀 설정
LED_PIN = 17

# GPIO 설정
GPIO.setmode(GPIO.BCM)
GPIO.setup(LED_PIN, GPIO.OUT)

# LED 켜기
GPIO.output(LED_PIN, GPIO.HIGH)
print("LED ON")

# LED 상태를 유지하기 위해 대기 (필요 시 추가)
time.sleep(2)

# GPIO 리소스 정리
#GPIO.cleanup()
