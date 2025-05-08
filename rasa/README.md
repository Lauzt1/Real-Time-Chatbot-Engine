cd "C:\Users\lauzt\Documents\Rasa Projects\Real-Time-Chatbot-Engine\rasa"

# Create new virtual environment
python -m venv .venv

# Activate the virtual environment
.\.venv\Scripts\activate
pip install rasa
rasa init

rasa train

rasa run actions

rasa shell --endpoints endpoints.yml

rasa shell --debug