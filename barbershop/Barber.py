from threading import Thread
from time import sleep

class Barber:
    '''The class represents a higher level barber thread constructor.
    '''
    def __init__(self, barber_semaphore, customer_semaphore, seat_semaphore, customer_queue):
        self.customer_semaphore = customer_semaphore
        self.barber_semaphore = barber_semaphore
        self.seat_semaphore = seat_semaphore
        self.customer_queue = customer_queue
    
    def initialize_barber(self, name):
        def barber_func():
            while True:
                print('Barber {} waits for new customers.'.format(name))
                self.customer_semaphore.acquire()
                self.seat_semaphore.release()
                customer_name = self.customer_queue.get()
                print('Barber {} is serving {}.'.format(name, customer_name))
                '''
                TODO: DO something with customer
                '''
                sleep(5)
                print('{} has been served.'.format(customer_name))
                self.barber_semaphore.release()
        return barber_func

    def create_barber_thread(self, name):
        '''Return a barber thread for further execution.

        Args:
            name[string]: The name of the barber.
        
        Return:
            A thread objects that represents a barber. Need to call run() method to actually
            start the thread.
        '''
        barber_thread = Thread(target=self.initialize_barber(name), name=name)
        return barber_thread
