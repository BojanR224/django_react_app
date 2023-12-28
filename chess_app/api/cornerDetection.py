import cv2 
import tensorflow as tf
from tensorflow import keras
import os
import numpy as np
import matplotlib.pyplot as plt
from scipy.spatial.distance import cdist
import imutils
from django.conf import settings

class CornerDetection():

    def __init__(self, main_image = None):
        """

        Args:
            detect_model_path (string): Folder path to Keras Pose Model
        """
        # Speed up inference
        tf.config.optimizer.set_jit(True)
        # Prevent CuDNN Error

        
        # physical_devices = tf.config.experimental.list_physical_devices('GPU')
        # if len(physical_devices) > 0:
        #     tf.config.experimental.set_memory_growth(physical_devices[0], True)

        self.detection_model = settings.DETECTION_MODEL
        self.piece_detection = settings.PIECE_DETECTION_MODEL
        self.main_image = main_image

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
    
    def rotate_and_predict(self, angle):
        """Rotates input img and runs prediction again

        Args:
            angle ([type]): angle in degrees

        Returns:
            [type]: returns prediction with corrected rotation
        """
        rot_imgs = imutils.rotate(self.img_rgb, angle=-angle)
        predictions = self.detection_model.predict(
            np.expand_dims(rot_imgs, axis=0))
        if self.overlappingPoints(predictions):
            return None
        # Correct rotation of predicted points
        M = cv2.getRotationMatrix2D((256, 192), angle, 1)
        predictions[0, :, 2] = 1
        predictions[0, :, 0:2] = (M@predictions[0].T).T
        return predictions

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

    def chessboard_to_fen(self, chessboard):
        fen_string = ""
        file = ""
        empty_squares = 0
        for i in range(0, 64):
            if chessboard[i][1] == "E":
                empty_squares += 1
            else:
                if empty_squares != 0:
                    file += str(empty_squares)
                empty_squares = 0
                file += chessboard[i][1]

            if (i+1)%8==0:
                if i == 7:
                    fen_string = file
                else:
                    fen_string = file + "/" + fen_string
                file = ""
                empty_squares = 0
        return fen_string + " w KQkq - 0 1"


        
    def predict_square(self, image_square):
        pieces  = ["b", "k", "n", "p", "q", "r", "E", "B", "K", "N", "P", "Q", "R"]
        image = cv2.cvtColor(image_square, cv2.COLOR_RGB2BGR)
        image = cv2.resize(image, (224,224), interpolation = cv2.INTER_LANCZOS4)

        image = [[[[3]]]+image]

        image = tf.image.convert_image_dtype(image, dtype=tf.float32)
        predictions = self.piece_detection.predict(image)
        # max_value = max(predictions[0])
        # max_index = np.where(predictions[0] == max_value)
        max_index = np.argmax(predictions[0])
        return pieces[max_index]

    def main(self, image):
        detect = CornerDetection()

        image_bytes = image.read()
        img = cv2.imdecode(np.frombuffer(image_bytes, np.uint8), -1)
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)


        
        width, height, _ = img.shape
        corners = detect.predict_board_corners(img)
        
        corners  = np.array([arr.tolist() for arr in corners])

        corners = np.array([[int(np.round(corner[0] * height / 512)), int(np.round(corner[1] * width / 384))] for corner in corners])


        if len(corners) == 4:
            # plt.imshow(img)
            # plt.scatter(corners[:, 0], corners[:, 1], marker=".", color="red", s=20)
            # plt.show()
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
            # plt.imshow(new_img)
            # plt.show()

            # single_square_corners = np.array([(0, 0), (single_square_max, 0), (single_square_max, single_square_max), (0, single_square_max)])
            predicted_chessboard = []
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

                predicted_square = self.predict_square(cropped_image)

                # chessboard[i] = (chessboard[i][5], predicted_square)
                predicted_chessboard.append((chessboard[i][4], predicted_square))

            print(predicted_chessboard)
            return self.chessboard_to_fen(predicted_chessboard)

        else:
            return None


def main(image):
    detect = CornerDetection()
    detect.main(image)
