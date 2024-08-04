import tkinter as tk

def call_back(event):
    value = entry.get()
    if len(str(value)) > 0:
        print(value)

root = tk.Tk()

entry = tk.Entry(root)
entry.pack()
entry.bind('<Return>', call_back)

root.mainloop()