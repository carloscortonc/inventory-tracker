import subprocess

def list_usb_devices():
    # Run the lsusb command
    result = subprocess.run(['lsusb'], stdout=subprocess.PIPE, text=True)
    # Split the output into lines
    lines = result.stdout.split('\n')
    return lines

usb_devices = list_usb_devices()

print("Devices found:")
for device in usb_devices:
    print(device)
