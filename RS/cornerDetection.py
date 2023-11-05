import cv2 
import tensorflow as tf
from tensorflow import keras
from chessboard import Chessboard
import glob
import numpy as np
import matplotlib.pyplot as plt
from scipy.spatial.distance import cdist

class CornerDetection():

    def __init__(self):
        """

        Args:
            detect_model_path (string): Folder path to Keras Pose Model
        """
        # Speed up inference
        tf.config.optimizer.set_jit(True)
        # Prevent CuDNN Error
        physical_devices = tf.config.experimental.list_physical_devices('GPU')
        if len(physical_devices) > 0:
            tf.config.experimental.set_memory_growth(physical_devices[0], True)
        
        self.detection_model = keras.models.load_model("models/detection")

    def overlappingPoints(self, predictions):
        """Check if points are too close to another

        Args:
            predictions ([type]): output of the nn estimation

        Returns:
            [bool]: Returns true if points are overlapping 
        """

        points = predictions[0, 0:4, 0:2]
        distances = np.triu(cdist(points, points))
        distances[distances == 0] = np.inf
        indxs = np.argwhere(distances < 30)
        return not len(indxs) == 0

    def refine_predictions(self, predictions):
        """Sort predicted corners in a clockwise fashion. Top left corner is the first element

        Args:
            predictions ([type]): predictions of nn model

        Returns:
            [type]: corrected corner points
        """
        points = predictions[0, :, 0:2].astype(int)
        hull = cv2.convexHull(points, clockwise=False)[:, 0]
        s = hull.sum(axis=1)[0:4]
        corner_pts = list(np.roll(hull, -np.argmin(s), axis=0))
        return corner_pts

    def preprocessImg(self, img):
        """Preprocess the image before processing it .

        Args:
            img ([type]): [description]
        """
        self.img_rgb = cv2.resize(img, (512, 384))
        self.img_rgb = cv2.cvtColor(self.img_rgb, cv2.COLOR_BGR2RGB)

    def predict_board_corners(self, img):
        """ Function detects for coners of chessboard

        Args:
            img ([type]): Image in BGR order
        """
        assert img.shape[2] == 3, "image should be in color"

        # convert img to right size and rgb order
        self.preprocessImg(img)

        # estimate 4 board corners
        predictions = self.detection_model.predict(
            np.expand_dims(self.img_rgb, axis=0))

        # if two points are too close -> rotate image by 45degrees and predict again
        if(self.overlappingPoints(predictions)):
            predictions = self.rotate_and_predict(30)

        if predictions is None:
            cv2.putText(self.img_rgb, "Cant detect board", (225, 370),
                cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2, cv2.LINE_AA)
            return []

        # sort chessboard cornerpoints in a clockwise fashion starting with top left point
        self.corner_pts = self.refine_predictions(predictions)
        return self.corner_pts
    
    def create_split_points(self, width, height):
        # Calculate the x-coordinates of 8 equally spaced points along the width of the image
        x_points = [int(i * width / 8) for i in range(8)]

        # Calculate the y-coordinates of 8 equally spaced points along the height of the image
        y_points = [int(i * height / 8) for i in range(8)]

        x_list = [(x, 0) for x in x_points]

        y_list = [(0, y) for y in y_points]

        return x_list, y_list


    def map_to_chessboard(self, x_list, y_list, width, height):
    # Create a list of 64 tuples representing the chessboard squares
        chessboard = []
        for y, row in enumerate(y_list):
            for x, col in enumerate(x_list):
                square = chr(ord('A') + x) + str(8 - y)
                chessboard.append((col[0], row[1], col[0] + width, row[1] + height, square))

        return chessboard
    
    def main(self):
        detect = CornerDetection()

        filenames = glob.glob("input_imgs/*")
        filenames = sorted(filenames)

        for file in filenames:
            img = cv2.imread(file)
            width, height, _ = img.shape
            corners = detect.predict_board_corners(img)
            
            corners  = np.array([arr.tolist() for arr in corners])

            corners = np.array([[int(np.round(corner[0] * height / 512)), int(np.round(corner[1] * width / 384))] for corner in corners])

            # corners = np.array([[int(np.round(corner[0] * height / 512)), int(np.round(corner[1] * width / 384))] for corner in corners])

            if len(corners) == 4:
                plt.imshow(img)
                plt.scatter(corners[:, 0], corners[:, 1], marker=".", color="red", s=20)
                plt.show()
                # detect.predictBoard(img, corners)

                # square_side_max = max(width, height)

                new_size = (height, width)

                # widht i height smeni mesta?
                new_corners = np.array([(0, 0), (height, 0), (height, width), (0, width)])

                corners = corners.astype(np.float32)

                new_corners = new_corners.astype(np.float32)

                M = cv2.getPerspectiveTransform(corners, new_corners)

                new_img = cv2.warpPerspective(img, M, new_size)

                x_list, y_list = self.create_split_points(height, width)
                new_width, new_height = int(width / 8), int(height / 8)

                chessboard = self.map_to_chessboard(x_list, y_list, new_width, new_height)
                print(chessboard)
                plt.imshow(new_img)
                plt.show()

                # single_square_corners = np.array([(0, 0), (single_square_max, 0), (single_square_max, single_square_max), (0, single_square_max)])
                imgs = []
                for i, square in enumerate(chessboard):
                    x = square[0]
                    y = square[1]
                    x_h = square[2]
                    y_w = square[3]

                    new_single_square_corners = np.array([(0, 0), (new_width, 0), (new_width, new_height), (0, new_height)])
                    new_single_square_corners = new_single_square_corners.astype(np.float32)

                    new_corners = np.array([(x, y), (x_h, y), (x_h, y_w), (x, y_w)])
                    # new_corners = np.array([(x, y), (y_w, y), (y_w, x_h), (x, x_h)])
                    new_corners = new_corners.astype(np.float32)

                    M = cv2.getPerspectiveTransform(new_corners, new_single_square_corners)

                    cropped_image = cv2.warpPerspective(new_img, M, (new_height, new_width))

                    # cropped_image = cv2.resize(cropped_image, (100, 100))
                    
                    imgs.append(cropped_image)

                    # prediction = model.predict(cropped_image, confidence=40, overlap=30).json()
                    # Treniraj uste eden model na roboflow so pogolemo podatocno mnozestvo i po spesificno klasificiranje ( dosta so tie konji)

                    # chessboard[i] = (chessboard[i][0], chessboard[i][1], chessboard[i][2], chessboard[i][3],chessboard[i][4], prediction['predictions'][0]['class'] if len(prediction['predictions']) > 0 else 'empty')


                print(chessboard)
                plt.imshow(new_img)
                plt.show()
                for img in imgs:
                    plt.imshow(img)
                    plt.show()

                # fen_string = chessboard.predictions_to_fen(predictions)
                # print(fen_string)

                # chessboard_points = [(t[0], t[1]) for t in chessboard]

                # for point in chessboard_points:
                #     # cv2.putText(new_img, str(point[2]), (int(point[0]), int(point[1])), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
                #     cv2.rectangle(new_img, point, (point[0] + int(width/8), point[1] + int(height/8)), (0, 0, 255), 1)

                # cv2.namedWindow("Labeled Image", cv2.WINDOW_NORMAL)
                # cv2.imshow("Labeled Image", new_img)
                # cv2.waitKey(0)

            else:
                print(corners)
                plt.imshow(img)
                plt.show()

if __name__ == "__main__":
    detect = CornerDetection()
    detect.main()
