from threading import Thread
from .utils import emit

class ThreadCreator:
    '''The class represents a higher level thread constructor.
    '''
    target = None
    name = None
    def __init__(self, barber_semaphore, customer_semaphore, seat_semaphore, customer_queue, message_queue):
        self.customer_semaphore = customer_semaphore
        self.barber_semaphore = barber_semaphore
        self.seat_semaphore = seat_semaphore
        self.customer_queue = customer_queue
        self.message_queue = message_queue
    
    def initialize(self, name):
        '''All child classes need to override this function.
        '''
        def func():
            pass
        return func

    def trigger(self, event_type, **kwargs):
        self.message_queue.put(emit(self.target, event_type, **kwargs))

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
