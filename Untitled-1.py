import time  # time 모듈을 가져옵니다

# 1부터 30까지 5초 간격으로 출력
for i in range(1, 31):
    print(i)
    time.sleep(5)  # 5초 동안 대기

# 또는 while 반복문을 사용할 수도 있습니다:
# num = 1
# while num <= 30:
#     print(num)
#     time.sleep(5)  # 5초 동안 대기
#     num += 1
