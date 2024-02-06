#PROGRAMME QUI LIT LE QRCODE
import zbarlight
from PIL import Image

def read_qr_code(image_path):
    with open(image_path, 'rb') as image_file:
        image =Image.open(image_file)
        image.load()

    codes = zbarlight.scan_codes(['qrcode'], image)

    if codes is not None and len(codes) > 0:
        qr_code_data = codes[0].decode('utf-8')
        return qr_code_data
    else: 
        return None

if __name__ == '__main__':
    image_path = '/home/adrienclement/TEST/image.jpg'
    qr_code_data = read_qr_code(image_path)


    if qr_code_data:
        print("données du QR code :", qr_code_data)
    else:
        print('aucun qr code trouvé dans l image')
