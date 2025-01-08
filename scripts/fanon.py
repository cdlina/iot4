# fanon.py
import RPi.GPIO as GPIO
import time

# GPIO 핀 번호
FAN_PIN = 24

# GPIO 설정
GPIO.setmode(GPIO.BCM)
GPIO.setup(FAN_PIN, GPIO.OUT)

# LED 켜기
GPIO.output(FAN_PIN, GPIO.HIGH)
print("FAN ON")

# FAN 상태를 유지하기 위해 대기 (필요 시 추가)
time.sleep(2)

# GPIO 리소스 정리
#GPIO.cleanup()

#try:
#    GPIO.output(FAN_PIN, GPIO.HIGH)  # FAN ON
#    print("Fan turned ON")
#except Exception as e:
#    print(f"Error: {e}")
#finally:
#    GPIO.cleanup()