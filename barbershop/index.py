from threading import Thread, Semaphore, BoundedSemaphore
from time import sleep
from random import choice
import sys
from queue import Queue

from .conf import barber_list
from .Barber import Barber as B
from .Customer import Customer as C

BABER_COUNT = 5
SEAT_COUNT = 5

barber_semaphore = BoundedSemaphore(BABER_COUNT)
customer_semaphore = Semaphore(0)
seat_semaphore = BoundedSemaphore(SEAT_COUNT)

customer_queue = Queue(SEAT_COUNT)

Barber = B(barber_semaphore, customer_semaphore, seat_semaphore, customer_queue)
Customer = C(barber_semaphore, customer_semaphore, seat_semaphore, customer_queue)

def dispatch_customer():
    # Keep sending customer at a random Interval.
    i = 0
    while True:
        # FIXME The time is set to 2 seconds for now. Should change to some random interval.
        i = (i + 1) % 100
        sleep(1)
        customer_name = 'Customer ' + str(i)
        customer = Customer.create_thread(customer_name)
        customer.start()

def main():
    # Create some barbers waiting for customers.
    for name in barber_list:
        barber = Barber.create_thread(name)
        barber.start()
    
    Thread(target=dispatch_customer).start()

    while True:
        line = sys.stdin.readline()
        print(line, flus=True)