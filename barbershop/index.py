from threading import Thread, Semaphore, BoundedSemaphore, Lock
from time import sleep
from random import choice
import sys
from queue import Queue
import json
import signal

from .argument_parse import argparser
from .utils import get_next_time
from .message import MessageQueue
from .conf import BARBER_LIST
from .Barber import Barber as B
from .Customer import Customer as C

args = argparser.parse_args()

barber_semaphore = BoundedSemaphore(args.barber_number)
customer_semaphore = Semaphore(0)
seat_semaphore = BoundedSemaphore(args.seat)

customer_queue = Queue(args.seat)
message_queue = MessageQueue()

Barber = B(args.barber_serve_time ,barber_semaphore, customer_semaphore,
           seat_semaphore, customer_queue, message_queue.get_queue())
Customer = C(barber_semaphore, customer_semaphore,
             seat_semaphore, customer_queue, message_queue.get_queue())

customer_count_lock = Lock()
customer_count = 0

def dispatch_customer():
    global customer_count
    with customer_count_lock:
        customer_count += 1
    customer_name = 'Customer ' + str(customer_count)
    customer = Customer.create_thread(customer_name)
    customer.start()

def start_dispatch_customer():
    def dispatch_func():
        while True:
            dispatch_customer()
            sleep(get_next_time(args.customer_rate))
    Thread(target=dispatch_func).start()

def start_message_queue():
    Thread(target=message_queue.listen_on_queue()).start()

def main():
    start_message_queue()
    
    # Create some barbers waiting for customers.
    for name in BARBER_LIST[:args.barber_number]:
        barber = Barber.create_thread(name)
        barber.start()

    start_dispatch_customer()
    
    # Listening on incoming message.
    while True:
        message = sys.stdin.readline()
        if message:
            print(message, flush=True)
            message = json.loads(message)
            if message['type'] == 'add' and message['target'] == 'customer':
                dispatch_customer()
