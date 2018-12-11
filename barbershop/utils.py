from random import expovariate
def get_next_time(rate):
    '''Produce time range until next customer's arrival.

        We use a Poission model to produce the random time interval 
        until the next customer's arrival.
        Args:
            rate: The rate is the amount of customer that should enter the barbershop
            within 1 second.
        Returns:
            The time interval(seconds).
    '''
    return expovariate(rate)
