from .modules import ThreadCreator

class Customer(ThreadCreator):
    def initialize(self, name):
        def customer_func():
            print('{} has entered the barbershop.'.format(name), flush=True)
            # Do not block thread activity.
            can_seat = self.seat_semaphore.acquire(blocking=False)
            if not can_seat:
            # Exit the thread because the seat is full.
                print('{} left because of no available seats. '.format(name), flush=True)
            else:
            # Signal barber that a customer has been added into waiting queue.
                self.customer_semaphore.release()
                self.customer_queue.put(name)
                self.barber_semaphore.acquire()
                '''
                TODO: Wait for cuting hair.
                '''
        return customer_func
