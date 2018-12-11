from threading import Thread, Semaphore, BoundedSemaphore
from time import sleep
from random import choice
import sys
from queue import Queue

from .utils import get_next_time
from .message import MessageQueue
from .conf import BARBER_LIST, CUSTOMER_RATE
from .Barber import Barber as B
from .Customer import Customer as C

BABER_COUNT = 5
SEAT_COUNT = 5

barber_semaphore = BoundedSemaphore(BABER_COUNT)
customer_semaphore = Semaphore(0)
seat_semaphore = BoundedSemaphore(SEAT_COUNT)

customer_queue = Queue(SEAT_COUNT)
message_queue = MessageQueue()

Barber = B(barber_semaphore, customer_semaphore,
           seat_semaphore, customer_queue, message_queue.get_queue())
Customer = C(barber_semaphore, customer_semaphore,
             seat_semaphore, customer_queue, message_queue.get_queue())


def dispatch_customer():
    # Keep sending customer at a random Interval.
    i = 0
    while True:
        i += 1
        sleep(get_next_time(CUSTOMER_RATE))
        customer_name = 'Customer ' + str(i)
        customer = Customer.create_thread(customer_name)
        customer.start()

def main():
    # Create some barbers waiting for customers.
    for name in BARBER_LIST:
        barber = Barber.create_thread(name)
        barber.start()
    
    Thread(target=dispatch_customer).start()
    Thread(target=message_queue.listen_on_queue()).start()
    while True:
        message = sys.stdin.readline()
        print(message, flush=True)
