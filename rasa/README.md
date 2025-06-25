cd "C:\Users\lauzt\Documents\Rasa Projects\Real-Time-Chatbot-Engine\rasa"

# just trying to run it
.\.venv\Scripts\activate
rasa train
rasa shell
# run action server
rasa run actions
# run the api
rasa run --enable-api --cors "*"
# run the api with debug
rasa run --enable-api --cors "*" --debug

# test the mongodb database
python "C:\Users\lauzt\Documents\Rasa Projects\Real-Time-Chatbot-Engine\rasa\scripts\print_collections.py"

# when you start fresh
# (dont use this) Create new virtual environment
python -m venv .venv
# Activate the virtual environment
.\.venv\Scripts\activate
pip install rasa
pip install pymongo python-dotenv
rasa init
rasa train
rasa shell --endpoints endpoints.yml
