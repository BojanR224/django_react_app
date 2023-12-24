from keras.models import load_model
import keras

keras.backend.clear_session()
# with keras.backend.get_session().graph.as_default():
#       model = load_model("my-modelv2/")