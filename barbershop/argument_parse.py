import argparse

from .conf import CUSTOMER_RATE, BARBER_COUNT, SEAT_COUNT, BARBER_SERVE_TIME

argparser = argparse.ArgumentParser()
argparser.add_argument('-bn', '--barber_number',
                       help='The number of barbers, which has a maximum number of 10.', default=BARBER_COUNT, type=int)
argparser.add_argument('-br', '--barber_serve_time', help='The lambda argument for deciding how how many customers should' 
'a barber serve in 10 seconds.', default=BARBER_SERVE_TIME)
argparser.add_argument('-cr', '--customer_rate', help='The lamda argument for deciding how many should enter in 10 seconds.', default=CUSTOMER_RATE)
argparser.add_argument(
    '-s', '--seat', help='The seat number.', default=SEAT_COUNT, type=int)
