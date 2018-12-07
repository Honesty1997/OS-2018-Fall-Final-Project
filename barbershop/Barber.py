from time import sleep

from .modules import ThreadCreator

class Barber(ThreadCreator):
    '''The class represents a higher level barber thread constructor.
    '''
    def initialize(self, name):
        def barber_func():
            while True:
                self.send('Barber {} waits for new customers.'.format(
                    name))
                self.customer_semaphore.acquire()
                self.seat_semaphore.release()
                customer_name = self.customer_queue.get()
                self.send('Barber {} is serving {}.'.format(
                    name, customer_name))
                '''
                    TODO: Do something with customer
                '''
                sleep(20)
                self.send('{} has been served.'.format(
                    customer_name))
                self.barber_semaphore.release()
        return barber_func
