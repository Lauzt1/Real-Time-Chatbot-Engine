cd "C:\Users\lauzt\Documents\Rasa Projects\Real-Time-Chatbot-Engine\rasa"

# just trying to run it
.\.venv\Scripts\activate
rasa train
rasa shell

# Create new virtual environment
python -m venv .venv

# Activate the virtual environment
.\.venv\Scripts\activate
pip install rasa
pip install pymongo python-dotenv
rasa init

rasa train

rasa run actions

rasa shell --endpoints endpoints.yml
