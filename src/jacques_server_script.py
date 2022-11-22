from jacques import JacquesServer
import argparse

parser = argparse.ArgumentParser()
parser.add_argument("--host", default="127.0.0.1")
parser.add_argument("--port", default=8000, type=int)
args = parser.parse_args()

JacquesServer(args.host, args.port)