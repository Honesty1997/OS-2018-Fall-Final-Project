from threading import Thread

class ThreadCreator:
    '''The class represents a higher level thread constructor.
    '''
    def __init__(self, barber_semaphore, customer_semaphore, seat_semaphore, customer_queue):
        self.customer_semaphore = customer_semaphore
        self.barber_semaphore = barber_semaphore
        self.seat_semaphore = seat_semaphore
        self.customer_queue = customer_queue
    
    def initialize(self, name):
        '''All child classes need to override this function.
        '''
        def func():
            pass
        return func

    def create_thread(self, name):
        '''Return a thread for further execution.

        Args:
            name[string]: The name of the thread.
        
        Return:
            A thread objects. Need to call start() method to actually
            start the thread.
        '''
        thread = Thread(target=self.initialize(name), name=name)
        thread.setDaemon(True)
        return thread
