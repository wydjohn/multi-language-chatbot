import os
import random
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from langdetect import detect
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

nltk.download('punkt')
nltk.download('stopwords')

GREETINGS = {
    "en": ["Hello, how can I help you?", "Hi, what can I do for you?", "Hello there, need assistance?"],
    "es": ["Hola, ¿cómo puedo ayudarte?", "Hola, ¿qué puedo hacer por ti?", "Hola, ¿necesitas ayuda?"]
}
GOODBYES = {
    "en": ["Goodbye!", "Bye, take care!", "Goodbye! If you need anything else, just ask."],
    "es": ["¡Adiós!", "¡Hasta luego, cuídate!", "¡Adiós! Si necesitas algo más, solo pregunta."]
}
UNSURE_RESPONSE = {
    "en": ["I'm not quite sure what you're asking.", "Could you clarify that?", "I don't understand."],
    "es": ["No estoy seguro de lo que estás preguntando.", "¿Podrías aclarar eso?", "No entiendo."]
}

if os.path.exists('.env'):
    from dotenv import load_dotenv
    load_dotenv()

def preprocess_text(text):
    detected_language = detect(text)
    try:
        stop_words = set(stopwords.words(detected_language))
    except:
        stop_words = set(stopwords.words('english'))  # Fallback to English if the language is unsupported
    words = word_tokenize(text.lower())
    filtered_words = [word for word in words if word.isalnum() and word not in stop_words]
    return filtered_words, detected_language

def identify_intent(user_input):
    user_input_preprocessed, language = preprocess_text(user_input)
    if any(word in user_input_preprocessed for word in ['bye', 'goodbye', 'adiós']):
        return 'goodbye', language
    elif any(word in user_input_preprocessed for word in ['hi', 'hello', 'hola']):
        return 'greeting', language
    else:
        return 'unknown', language

def generate_response(intent, language):
    if language not in GREETINGS:
        language = 'en'  # Fallback to English if the detected language is not supported
    if intent == 'greeting':
        return random.choice(GREETINGS[language])
    elif intent == 'goodbye':
        return random.choice(GOODBYES[language])
    else:
        return UNSURE_RESPONSE[language][random.randint(0, len(UNSURE_RESPONSE[language])-1)]

def main():
    print("Bot: Hi! How can I assist you today?")
    
    while True:
        user_input = input("You: ")
        intent, language = identify_intent(user_input)
        
        if intent == 'goodbye':
            print(f"Bot: {generate_response(intent, language)}")
            break
        
        response = generate_response(intent, language)
        print(f"Bot: {response}")

if __name__ == "__main__":
    main()