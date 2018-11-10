from threading import Semaphore, BoundedSemaphore
from time import sleep
from random import choice
from queue import Queue

from conf import customer_list, barber_list
from Barber import Barber as B
from Customer import Customer as C

BABER_COUNT = 5
SEAT_COUNT = 10

barber_semaphore = BoundedSemaphore(BABER_COUNT)
customer_semaphore = Semaphore(0)
seat_semaphore = BoundedSemaphore(SEAT_COUNT)

customer_queue = Queue(SEAT_COUNT)

Barber = B(barber_semaphore, customer_semaphore, seat_semaphore, customer_queue)
Customer = C(barber_semaphore, customer_semaphore, seat_semaphore, customer_queue)

def main():
    # Create some barbers waiting for customers.
    for name in barber_list:
        barber = Barber.create_barber_thread(name)
        barber.start()
    
    # Keep sending customer at a random Interval.
    while True:
        # FIXME The time is set to 2 seconds for now. Should change to some random interval.
        sleep(1)
        customer_name = choice(customer_list)
        customer = Customer.create_customer_thread(customer_name)
        customer.start()

if __name__ == '__main__':
    main()
