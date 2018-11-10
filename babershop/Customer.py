from threading import Thread, Lock

class Customer:
    def __init__(self, customer_semaphore, baber_semaphore, seat_semaphore, customer_queue):
        self.customer_semaphore = customer_semaphore
        self.baber_semaphore = baber_semaphore
        self.seat_semaphore = seat_semaphore
        self.customer_queue = customer_queue

    def initialize_customer_function(self, name):
        def customer_func():
            print('{} has entered the babershop.'.format(name))
            # Do not block thread activity.
            self.seat_semaphore.acquire(block=False)
            if self.seat_semaphore._Semaphore__value < 0:
            # Exit the thread because the seat is full.
                self.seat_semaphore.release()
                print('Customer {} leaves because of full seats.'.format(name))
            else:
            # Signal baber that a customer has been added into waiting queue.
                self.customer_semaphore.release()
                self.customer_queue.enqueue(name)
                self.baber_semaphore.acquire()
                '''
                TODO: Wait for cuting hair.
                '''
        return customer_func

    def create_customer_thread(self, name):
        '''Return a customer thread for further execution.

        Args:
            name[string]: The name of the customer.
        
        Return:
            A thread objects that represents a customer. Need to call run() method to actually
            start the thread.
        '''
        customer_thread = Thread(target=self.initialize_customer_function(name), name=name)
        return customer_thread

class CustomerQueue:
    def __init__(self):
        self.lock = Lock()
        self.queue = []

    def dequeue(self):
        '''Remove the first customer from the queue.

        Returns:
            The customer's name.
        '''
        self.lock.acquire()
        '''
        TODO: Dequeue the customer.
        '''
        self.lock.release()

    def enqueue(self, customer):
        self.lock.acquire()
        '''
        TODO: Enqueue the customer.
        '''
        self.lock.release()