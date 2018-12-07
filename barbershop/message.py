from queue import Queue

class MessageQueue:
    def __init__(self, *args, **kwargs):
        self.queue = Queue(-1)
    
    def get_queue(self):
        return self.queue
    
    def listen_on_queue(self):
        def listen_func():
            while True:
                message = self.queue.get(block=True)
                print(message, flush=True)
        return listen_func
