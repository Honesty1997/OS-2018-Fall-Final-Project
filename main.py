from threading import Thread, current_thread, active_count
import time
arr = []

def target(arr, num):
    time.sleep(num)
    print(num)
    arr.append(num)

curr_thread = current_thread()

for i in range(5):
    new_thread = Thread(target=target, args=[arr, i])
    new_thread.start()
print(active_count())
