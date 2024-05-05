import spacy
from langdetect import detect
from googletrans import Translator

nlp_en = None

translator = Translator()

def get_nlp_en():
    global nlp_en
    if nlp_en is None:
        nlp_en = spacy.load('en_core_web_sm')
    return nlp_en

def detect_language(text):
    try:
        lang_code = detect(text)
        return lang_code
    except Exception as e:
        print(f"Error detecting language: {e}")
        return None

def translate_to_english(text):
    try:
        translated_text = translator.translate(text, dest='en').text
        return translated_text
    except Exception as e:
        print(f"Error translating text: {e}")
        return None

def process_text_based_on_language(text):
    try:
        lang_code = detect_language(text)
        if lang_code == 'en':
            doc = get_nlp_en()(text)
            return "Processed English text."
        else:
            translated_text = translate_to_english(text)
            doc = get_nlp_en()(translated_text)
            return "Processed non-English text translated to English."
    except Exception as e:
        print(f"Error processing text: {e}")
        return None

if __name__ == "__main__":
    text = "Hello, how are you?"
    print(process_text_based_on_language(text))