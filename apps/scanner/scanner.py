import serial

# Configuration
serial_port = '/dev/hidraw0'  
baud_rate = 9600 
# file_count = 1 

# Initialize serial connection
scanner = serial.Serial(serial_port, baud_rate, timeout=1)

# Start the barcode data capture loop
while True:
    data = scanner.readline()
    if data:
        # Decode byte data to string and remove trailing newline
        barcode_data = data.decode('utf-8').rstrip()

        print(barcode_data)

        # # Define the file name with an incrementing count
        # file_name = f"barcode_{file_count}.txt"
        
        # # Save the barcode data to a new file
        # with open(file_name, 'w') as file:
        #     file.write(barcode_data)

        # print(f"Barcode data saved to {file_name}.")

        # # Increment the file count for the next barcode data
        # file_count += 1