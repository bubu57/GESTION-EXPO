#programme autonome qui peut lire les données du QRCODE
import picamera
import zbarlight
from PIL import Image

def capture_and_read_continuous():
    with picamera.PiCamera() as camera:
        camera.resolution = (1024, 768)

        while True:
            file_path = '/home/adrienclement/TEST/image.jpg'
            camera.capture(file_path)
            
            with open(file_path, 'rb') as image_file:
                image = Image.open(image_file)
                image.load()

            codes =zbarlight.scan_codes(['qrcode'], image)

            if codes is not None and len(codes) > 0:
                qr_code_data = codes[0].decode('utf-8')
                print('données du QR code :', qr_code_data)
            else:
                print('aucun QR code trouvé dans l image')

if __name__ == '__main__':
    capture_and_read_continuous()
