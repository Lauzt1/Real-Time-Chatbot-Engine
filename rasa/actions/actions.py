from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
import os, json
from datetime import datetime

class ActionRagAnswer(Action):
    def name(self) -> Text:
        return "action_rag_answer"

    def run(self,
            dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        user_msg = tracker.latest_message.get("text")
        # TODO: hook up your retriever → generator here
        dispatcher.utter_message(text="(RAG placeholder) Fetching the best answer for you…")
        return []

class ActionSaveConversation(Action):
    def name(self) -> Text:
        return "action_save_conversation"

    def run(self,
            dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List:

        log_dir = "logs"
        os.makedirs(log_dir, exist_ok=True)
        ts = datetime.now().strftime("%Y%m%d_%H%M%S")
        sid = tracker.sender_id
        path = f"{log_dir}/conv_{sid}_{ts}.json"

        events = [e for e in tracker.events if e.get("event") in {"user", "bot"}]
        with open(path, "w", encoding="utf-8") as f:
            json.dump(events, f, ensure_ascii=False, indent=2)

        return []