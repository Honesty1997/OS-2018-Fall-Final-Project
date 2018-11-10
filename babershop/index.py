from threading import Semaphore, BoundedSemaphore
from time import sleep

from Baber import Baber as B
from Customer import Customer as C, CustomerQueue

BABER_COUNT = 5
SEAT_COUNT = 10

baber_semaphore = BoundedSemaphore(BABER_COUNT)
customer_semaphore = Semaphore(0)
seat_semaphore = BoundedSemaphore(SEAT_COUNT)

baber_names = ['Willy', 'Pearl', 'Kevin', 'Robin']

customer_queue = CustomerQueue()

Baber = B(baber_semaphore, customer_semaphore, seat_semaphore, customer_queue)
Customer = C(baber_semaphore, customer_semaphore, seat_semaphore, customer_queue)

def main():
    # Create some babers waiting for customers.
    for name in baber_names:
        baber = Baber.create_baber_thread(name)
        baber.run()
    
    # Keep sending customer at a random Interval.
    while True:
        # FIXME The time is set to 2 seconds for now. Should change to some random interval.
        sleep(2)
        customer = Customer.create_customer_thread('A random name.')
        customer.run()

