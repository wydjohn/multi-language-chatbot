import spacy
from langdetect import detect
from googletrans import Translator

class MultiLanguageChatbot:
    def __init__(self):
        self.nlp_en = spacy.load('en_core_web_sm')
        self.translator = Translator()
    
    def detect_language(self, text):
        try:
            lang_code = detect(text)
            return lang_code
        except Exception as e:
            print(f"Error detecting language: {e}")
            return None

    def translate_to_english(self, text):
        try:
            translated_text = self.translator.translate(text, dest='en').text
            return translated_text
        except Exception as e:
            print(f"Error translating text: {e}")
            return None

    def process_text(self, text):
        try:
            lang_code = self.detect_language(text)
            if lang_code == 'en':
                doc = self.nlp_en(text)
                return "Processed English text."
            else:
                translated_text = self.translate_to_english(text)
                doc = self.nlp_en(translated_text)
                return "Processed non-English text translated to English."
        except Exception as e:
            print(f"Error processing text: {e}")
            return None

if __name__ == "__main__":
    chatbot = MultiLanguageChatbot()
    text = "Hello, how are you?"
    print(chatbot.process_text(text))