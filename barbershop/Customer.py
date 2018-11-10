from threading import Thread, Lock

class Customer:
    def __init__(self, barber_semaphore, customer_semaphore, seat_semaphore, customer_queue):
        self.customer_semaphore = customer_semaphore
        self.barber_semaphore = barber_semaphore
        self.seat_semaphore = seat_semaphore
        self.customer_queue = customer_queue

    def initialize_customer_function(self, name):
        def customer_func():
            print('{} has entered the barbershop.'.format(name))
            # Do not block thread activity.
            can_seat = self.seat_semaphore.acquire(blocking=False)
            if not can_seat:
            # Exit the thread because the seat is full.
                print('Customer {} leaves because of full seats.'.format(name))
            else:
            # Signal barber that a customer has been added into waiting queue.
                self.customer_semaphore.release()
                self.customer_queue.put(name)
                self.barber_semaphore.acquire()
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
