import os
import random
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from langdetect import detect

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

def detect_language(text):
    return detect(text)

def filter_stopwords_and_normalize(words, language):
    try:
        stop_words = set(stopwords.words(language))
    except:
        stop_words = set(stopwords.words('english'))
    return [word for word in words if word.isalnum() and word not in stop_words]

def preprocess_text(text):
    language = detect_language(text)
    words = word_tokenize(text.lower())
    filtered_words = filter_stopwords_and_normalize(words, language)
    return filtered_words, language

def identify_intent(user_input):
    processed_input, language = preprocess_text(user_input)
    if any(word in processed_input for word in ['bye', 'goodbye', 'adiós']):
        return 'goodbye', language
    elif any(word in processed_input for word in ['hi', 'hello', 'hola']):
        return 'greeting', language
    else:
        return 'unknown', language

def generate_response(intent, language):
    if intent == 'greeting':
        responses = GREETINGS
    elif intent == 'goodbye':
        responses = GOODBYES
    else:
        responses = UNSURE_RESPONSE
        
    chosen_language = language if language in responses else 'en'
    return random.choice(responses[chosen_language])

def chatbot_interaction():
    print("Bot: Hi! How can I assist you today?")
    while True:
        user_input = input("You: ")
        intent, language = identify_intent(user_input)
        response = generate_response(intent, language)
        
        print(f"Bot: {response}")
        
        if intent == 'goodbye':
            break

def main():
    chatbot_interaction()

if __name__ == "__main__":
    main()