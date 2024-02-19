# -*- coding: utf-8 -*-
import os, sys
# add ../../Sources to the PYTHONPATH
sys.path.append(os.path.join("..", "..", "Sources"))

from yocto_api import *
from yocto_digitalio import *


def usage():
    scriptname = os.path.basename(sys.argv[0])
    print("Usage:")
    print(scriptname + ' <serial_number>')
    print(scriptname + ' <logical_name>')
    print(scriptname + ' any')
    print('Example:')
    print(scriptname + ' any')
    sys.exit()


def die(msg):
    sys.exit(msg + ' (check USB cable)')


if len(sys.argv) < 2:
    usage()
target = sys.argv[1].upper()

# Setup the API to use local USB devices
errmsg = YRefParam()
if YAPI.RegisterHub("usb", errmsg) != YAPI.SUCCESS:
    sys.exit("init error" + errmsg.value)

if target == 'ANY':
    # retreive any Relay then find its serial #
    io = YDigitalIO.FirstDigitalIO()
    if io is None:
        die('No module connected')
    m = io.get_module()
    target = m.get_serialNumber()

print('using ' + target)
io = YDigitalIO.FindDigitalIO(target + '.digitalIO')

if not (io.isOnline()):
    die('device not connected')

io.set_portDirection(63)
io.set_portPolarity(192)
io.set_portOpenDrain(255)

outputdata = 0
while io.isOnline(): 
    inputdata = io.get_portState()
    if (inputdata == 128):
        io.set_portDirection(254)
        io.set_portPolarity(0)
    else:
       io.set_portState(outputdata) 
    YAPI.Sleep(1000, errmsg)

print('Module disconnected')
YAPI.FreeAPI()

