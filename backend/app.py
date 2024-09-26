from flask import Flask, request, jsonify
from flask_cors import CORS
import yfinance as yf
import pandas as pd
from openai import OpenAI
import os

app = Flask(__name__)
CORS(app)

# Set up OpenAI client
client = OpenAI(api_key=os.environ.get('OPENAI_API_KEY'))

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data['message']
    
    # Process the user's message and generate a response
    response = process_message(user_message)
    
    return jsonify({'response': response})

def process_message(message):
    # Use OpenAI to understand the intent and extract relevant information
    completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant for quantitative trading."},
            {"role": "user", "content": message}
        ]
    )
    
    ai_response = completion.choices[0].message.content
    
    # Check if we need to fetch financial data
    if "stock" in message.lower() or "price" in message.lower():
        # Extract ticker symbol (this is a simple example, you might want to use NLP for better extraction)
        words = message.split()
        ticker = next((word.upper() for word in words if word.isalpha() and len(word) <= 5), None)
        
        if ticker:
            stock_data = get_stock_data(ticker)
            ai_response += f"\n\nHere's the latest data for {ticker}:\n{stock_data}"
    
    return ai_response

def get_stock_data(ticker):
    stock = yf.Ticker(ticker)
    hist = stock.history(period="1d")
    
    if hist.empty:
        return f"No data available for {ticker}"
    
    latest_price = hist['Close'].iloc[-1]
    change = hist['Close'].iloc[-1] - hist['Open'].iloc[-1]
    change_percent = (change / hist['Open'].iloc[-1]) * 100
    
    return f"Latest price: ${latest_price:.2f}\nChange: ${change:.2f} ({change_percent:.2f}%)"

if __name__ == '__main__':
    app.run(debug=True)