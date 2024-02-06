#programme qui allume la camera et prend en photo
import time
import picamera

def capture_qr_code(file_path):
    with picamera.PiCamera() as camera :
        camera.resolution = (1024, 768)
        camera.start_preview()

        time.sleep(5)


        camera.capture(file_path)

if __name__ == '__main__':
    file_path = '/home/adrienclement/TEST/image.jpg'
    capture_qr_code(file_path)
    print(f'image enregistrée avec succès :{file_path}')
