import re, json, sys, os
import preprocessor as p
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
stop_words = set(stopwords.words("english"))

from keras.preprocessing.text import Tokenizer
from keras_preprocessing.text import tokenizer_from_json
from keras.preprocessing.sequence import pad_sequences
from keras.models import model_from_json



#Dataset Cleaning


ps = PorterStemmer()

#Clean the text
def regexCleaning(text):
  text = p.clean(text)
  text = re.sub('[^a-zA-Z]| {2,}',' ',text)
  text = text.lower()
  text = text.split()
  text = [ps.stem(word) for word in text if word not in stop_words]
  text = ' '.join(text)
  if(len(text)):
    return text
  else:
    pass


json_file = open('Bullying Model/model.json', 'r')
loaded_model_json = json_file.read()
json_file.close()
loaded_model = model_from_json(loaded_model_json)
# load weights into new model6
loaded_model.load_weights("Bullying Model/model.h5")
loaded_model.compile(loss='binary_crossentropy',optimizer='adam',metrics=['accuracy'])


with open('Bullying Model/tokenizer.json') as f:
    data = json.load(f)
    tokenizer = tokenizer_from_json(data)

def test_output(sentence):
  sentence = regexCleaning(sentence)
  sentence = [sentence]
  seq = tokenizer.texts_to_sequences(sentence)
  seq_padded = pad_sequences(seq, maxlen=50, truncating="post", padding="post")
  prediction = (loaded_model.predict(seq_padded) > 0.5).astype("int32")
  if(prediction):
    print(1)
  else:
    print(0)

test_output(str(sys.argv[1]))