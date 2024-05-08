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

    def translate_text(self, text, dest_lang='en'):
        try:
            translated_text = self.translator.translate(text, dest=dest_lang).text
            return translated_text
        except Exception as e:
            print(f"Error translating text: {e}")
            return None

    def translate_to_english(self, text):
        return self.translate_text(text, dest_lang='en')

    def translate_from_english(self, text, dest_lang):
        return self.translate_text(text, dest_lang=dest_lang)
    
    def process_text(self, text):
        try:
            lang_code = self.detect_language(text)
            response = ""
            if lang_code == 'en':
                response = "I have processed your english text."
            else:
                translated_text = self.translate_to_english(text)
                response = "I have processed your text and understood it."
                response = self.translate_from_english(response, lang_code)

            return response
        except Exception as e:
            print(f"Error processing text: {e}")
            return None

if __name__ == "__main__":
    chatbot = MultiLanguageChatbot()
    texts = ["Hello, how are you?", "Hola, ¿cómo estás?", "Bonjour, comment ça va?"]
    for text in texts:
        print(f"Input: {text}")
        print(f"Response: {chatbot.process_text(text)}\n")