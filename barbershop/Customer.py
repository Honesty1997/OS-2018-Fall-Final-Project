from .modules import ThreadCreator

class Customer(ThreadCreator):
    def initialize(self, name):
        def customer_func():
            self.send('{} has entered the barbershop.'.format(name))
            # Do not block thread activity.
            can_seat = self.seat_semaphore.acquire(blocking=False)
            if not can_seat:
            # Exit the thread because the seat is full.
                self.send('{} left because of no available seats. '.format(
                    name))
            else:
                # Signal barber that a customer has been added into waiting queue.
                self.customer_queue.put(name)
                self.customer_semaphore.release()
                self.barber_semaphore.acquire()
                '''
                TODO: Wait for cuting hair.
                '''
        return customer_func
