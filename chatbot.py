import os
import random
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

nltk.download('punkt')
nltk.download('stopwords')

GREETINGS = ["Hello, how can I help you?", "Hi, what can I do for you?", "Hello there, need assistance?"]
GOODBYES = ["Goodbye!", "Bye, take care!", "Goodbye! If you need anything else, just ask."]
UNSURE_RESPONSE = ["I'm not quite sure what you're asking.", "Could you clarify that?", "I don't understand."]

if os.path.exists('.env'):
    from dotenv import load_dotenv
    load_dotenv()

def preprocess_text(text):
    stop_words = set(stopwords.words('english'))
    words = word_tokenize(text.lower())
    filtered_words = [word for word in words if word.isalnum() and word not in stop_words]
    return filtered_words

def identify_intent(user_input):
    user_input_preprocessed = preprocess_text(user_input)
    if any(word in user_input_preprocessed for word in ['bye', 'goodbye']):
        return 'goodbye'
    elif any(word in user_input_preprocessed for word in ['hi', 'hello']):
        return 'greeting'
    else:
        return 'unknown'

def generate_response(intent):
    if intent == 'greeting':
        return random.choice(GREETINGS)
    elif intent == 'goodbye':
        return random.choice(GOODBYES)
    else:
        return UNSURE_RESPONSE[random.randint(0, len(UNSURE_RESPONSE)-1)]

def main():
    print("Bot: Hi! How can I assist you today?")
    
    while True:
        user_input = input("You: ")
        intent = identify_intent(user_input)
        
        if intent == 'goodbye':
            print(f"Bot: {generate_response(intent)}")
            break
        
        response = generate_response(intent)
        print(f"Bot: {response}")

if __name__ == "__main__":
    main()