from threading import Thread
from time import sleep
class Baber:
    '''The class represents a higher level baber thread constructor.
    '''
    def __init__(self, baber_semaphore, customer_semaphore, seat_semaphore, customer_queue):
        self.customer_semaphore = customer_semaphore
        self.baber_semaphore = baber_semaphore
        self.seat_semaphore = seat_semaphore
        self.customer_queue = customer_queue
    
    def initialize_baber(self, name):
        def baber_func():
            while True:
                print('Baber {} waits for new customers.'.format(name))
                self.customer_semaphore.acquire()
                self.seat_semaphore.release()
                customer_name = self.customer_queue.dequeue()
                print('Baber {} is serving Customer {}.'.format(name, customer_name))
                '''
                TODO: DO something with customer
                '''
                sleep(5)
                print('Customer {} has been served.'.format(customer_name))
                self.baber_semaphore.release()
        return baber_func

    def create_baber_thread(self, name):
        '''Return a baber thread for further execution.

        Args:
            name[string]: The name of the baber.
        
        Return:
            A thread objects that represents a baber. Need to call run() method to actually
            start the thread.
        '''
        baber_thread = Thread(target=self.initialize_baber(name), name=name)
        return baber_thread
