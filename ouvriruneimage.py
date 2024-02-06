#programme qui ouvre une image
from PIL import Image

file_path = '/home/adrienclement/TEST/image.jpg'

image = Image.open(file_path)

image.show()
