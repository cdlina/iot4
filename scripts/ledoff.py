import RPi.GPIO as GPIO

# GPIO 핀 설정
LED_PIN = 17

# GPIO 설정
GPIO.setmode(GPIO.BCM)
GPIO.setup(LED_PIN, GPIO.OUT)

# LED 끄기
GPIO.output(LED_PIN, GPIO.LOW)
print("LED OFF")

# GPIO 리소스 정리
GPIO.cleanup()
