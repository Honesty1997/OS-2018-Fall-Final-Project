from time import sleep

from .modules import ThreadCreator
from .utils import get_next_time
from .conf import BARBER_SERVE_TIME

class Barber(ThreadCreator):
    '''The class represents a higher level barber thread constructor.
    '''
    target = 'barber'
    def initialize(self, name):
        def barber_func():
            self.trigger('start', name=name)
            while True:
                self.trigger('wait', name=name)
                self.customer_semaphore.acquire()
                self.seat_semaphore.release()
                customer_name = self.customer_queue.get()
                self.trigger('serving', name=name, customer_name=customer_name)
                sleep(get_next_time(BARBER_SERVE_TIME))
                self.barber_semaphore.release()
                self.trigger('served', name=name, customer_name=customer_name)
        return barber_func
