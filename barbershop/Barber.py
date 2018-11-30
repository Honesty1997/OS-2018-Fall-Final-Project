from time import sleep

from .modules import ThreadCreator

class Barber(ThreadCreator):
    '''The class represents a higher level barber thread constructor.
    '''
    def initialize(self, name):
        def barber_func():
            while True:
                print('Barber {} waits for new customers.'.format(name), flush=True)
                self.customer_semaphore.acquire()
                self.seat_semaphore.release()
                customer_name = self.customer_queue.get()
                print('Barber {} is serving {}.'.format(name, customer_name), flush=True)
                '''
                    TODO: Do something with customer
                '''
                sleep(20)
                print('{} has been served.'.format(customer_name), flush=True)
                self.barber_semaphore.release()
        return barber_func