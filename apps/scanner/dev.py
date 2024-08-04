import evdev
from evdev import InputDevice, categorize, ecodes

input_device_path = '/dev/input/hidraw0'

device = InputDevice(input_device_path)

input_buffer = ''

print(f'Listening for barcode input on {input_device_path}...')

for event in device.read_loop():
    if event.type == evdev.ecodes.EV_KEY:
        key_event = categorize(event)
        if key_event.keystate == key_event.key_down:
            key = key_event.keycode
            if isinstance(key, list):  # some keys return a list, we need the first element
                key = key[0]
            if key == 'KEY_ENTER':
                print(f'Barcode: {input_buffer}')
                input_buffer = ''
            elif key.startswith('KEY_') and len(key) == 5:  # handles digits and single letters
                char = key[-1].lower()
                input_buffer += char
            elif key.startswith('KEY_') and len(key) == 6 and key[-2] == '_':  # handles letters
                char = key[-1].lower()
                input_buffer += char