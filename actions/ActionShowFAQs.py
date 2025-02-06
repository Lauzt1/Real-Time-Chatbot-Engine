import os
import csv
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SessionStarted, ActionExecuted

class ActionShowFAQs(Action):
    def name(self) -> str:
        return "action_show_faqs"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker, domain: dict):
        # Path to the CSV file (in the data folder)
        faq_file_path = os.path.join("data", "FAQ.csv")
        faqs = []

        try:
            with open(faq_file_path, newline='', encoding='utf-8') as csvfile:
                reader = csv.DictReader(csvfile)
                for row in reader:
                    faqs.append(row)
        except Exception as e:
            dispatcher.utter_message(text=f"Error loading FAQs: {e}")
            return []

        # Build a string that lists all FAQs
        faq_message = "Here are our FAQs. You can type the number of the question to get an answer:\n\n"
        for faq in faqs:
            faq_message += f"{faq['number']}. {faq['question']}\n"

        dispatcher.utter_message(text=faq_message)
        return []

class ActionAnswerFAQ(Action):
    def name(self) -> str:
        return "action_answer_faq"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker, domain: dict):
        # Get the user's input (expecting a number like "1", "2", etc.)
        user_input = tracker.latest_message.get('text').strip()
        faq_file_path = os.path.join("data", "FAQ.csv")
        selected_answer = None

        try:
            with open(faq_file_path, newline='', encoding='utf-8') as csvfile:
                reader = csv.DictReader(csvfile)
                for row in reader:
                    if row['number'] == user_input:
                        selected_answer = row['answer']
                        break
        except Exception as e:
            dispatcher.utter_message(text=f"Error processing your request: {e}")
            return []

        if selected_answer:
            dispatcher.utter_message(text=selected_answer)
        else:
            dispatcher.utter_message(text="Sorry, I couldn't find an FAQ for that number.")

        return []

class ActionSessionStart(Action):
    def name(self) -> str:
        return "action_session_start"

    async def run(self, dispatcher: CollectingDispatcher,
                  tracker: Tracker,
                  domain: dict) -> list:
        # Start a new session
        events = [SessionStarted()]

        # Option 1: Call your FAQ action's logic directly (reading from CSV)
        faq_file_path = os.path.join("data", "FAQ.csv")
        faqs = []
        try:
            with open(faq_file_path, newline='', encoding='utf-8') as csvfile:
                reader = csv.DictReader(csvfile)
                for row in reader:
                    faqs.append(row)
        except Exception as e:
            dispatcher.utter_message(text=f"Error loading FAQs: {e}")
        else:
            # Build the FAQ list message
            faq_message = "Here are our FAQs. You can type the number of the question to get an answer:\n\n"
            for faq in faqs:
                faq_message += f"{faq['number']}. {faq['question']}\n"
            dispatcher.utter_message(text=faq_message)

        # End the session start action by listening for the next user input
        events.append(ActionExecuted("action_listen"))
        return events