from time import sleep

from .modules import ThreadCreator
from .utils import get_next_time

class Barber(ThreadCreator):
    '''The class represents a higher level barber thread constructor.
    '''
    target = 'barber'
    def __init__(self, serve_rate, *args):
        self.serve_rate = serve_rate
        super().__init__(*args)
    
    def initialize(self, name):
        def barber_func():
            self.trigger('start', name=name)
            while True:
                self.trigger('wait', name=name)
                self.customer_semaphore.acquire()
                self.seat_semaphore.release()
                customer_name = self.customer_queue.get()
                self.trigger('serving', name=name, customer_name=customer_name)
                sleep(get_next_time(self.serve_rate))
                self.barber_semaphore.release()
                self.trigger('served', name=name, customer_name=customer_name)
        return barber_func
