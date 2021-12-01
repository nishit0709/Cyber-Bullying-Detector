import nltk
from nltk.corpus import stopwords
stop_words = set(stopwords.words("english"))
from nltk.stem import PorterStemmer
ps = PorterStemmer()



from keras.models import model_from_json
json_file = open('Bullying Model/model.json', 'r') #load model
loaded_model_json = json_file.read()
json_file.close()
loaded_model = model_from_json(loaded_model_json)
loaded_model.load_weights("Bullying Model/model.h5") #load weights 
loaded_model.compile(loss='binary_crossentropy',optimizer='adam',metrics=['accuracy']) 



import json
from keras_preprocessing.text import tokenizer_from_json
with open('Bullying Model/tokenizer.json') as f:
    data = json.load(f)
    tokenizer = tokenizer_from_json(data) #load tokenizer