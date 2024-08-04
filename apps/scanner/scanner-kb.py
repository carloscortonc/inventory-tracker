print("[scanner]")
while True:
    barcode_data = input()

    # Exit condition
    if barcode_data.lower() == 'exit':
        break

    print(barcode_data)

    # # Define the file name with an incrementing count
    # file_name = f"barcode_{file_count}.txt"
    
    # # Save the barcode data to a new file
    # with open(file_name, 'w') as file:
    #     file.write(barcode_data)

    # print(f"Barcode data saved to {file_name}.")

    # # Increment the file count for the next barcode data
    # file_count += 1