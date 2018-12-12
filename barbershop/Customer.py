from .modules import ThreadCreator
from .utils import emit

class Customer(ThreadCreator):
    target = 'customer'
    def initialize(self, name):
        def customer_func():
            self.trigger('enter', name=name)
            # Do not block thread activity.
            can_seat = self.seat_semaphore.acquire(blocking=False)
            if not can_seat:
            # Exit the thread because the seat is full.
                self.trigger('full', name=name)
            else:
                # Signal barber that a customer has been added into waiting queue.
                self.customer_queue.put(name)
                self.customer_semaphore.release()
                self.trigger('waiting', name=name)
                self.barber_semaphore.acquire()
                self.trigger('serving', name=name)
        return customer_func
