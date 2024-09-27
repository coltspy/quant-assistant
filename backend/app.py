import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
from newsapi import NewsApiClient
import yfinance as yf
import logging
import re

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Initialize OpenAI client
openai_api_key = os.getenv('OPENAI_API_KEY')


# Initialize NewsAPI client
newsapi = NewsApiClient(api_key='64137b487ad447e190241e109188422a')

# Dictionary mapping company names to stock tickers
company_to_ticker = {
    'apple': 'AAPL',
    'tesla': 'TSLA',
    'google': 'GOOGL',
    'microsoft': 'MSFT',
    'amazon': 'AMZN',
    'facebook': 'META',
    # Add more as needed
}

def get_stock_news(company):
    try:
        query = f'"{company}" AND (stock OR shares OR NASDAQ OR NYSE)'
        articles = newsapi.get_everything(q=query, language='en', sort_by='relevancy', page_size=5)
        
        if articles['totalResults'] > 0:
            news_summary = f"Here are the latest news headlines for {company}:\n\n"
            for article in articles['articles']:
                news_summary += f"- {article['title']}\n  {article['url']}\n\n"
            return news_summary
        else:
            return f"No recent news found for {company}."
    except Exception as e:
        logger.error(f"Error retrieving news for {company}: {str(e)}")
        return f"Unable to retrieve news for {company}."

def get_stock_price(ticker):
    try:
        stock = yf.Ticker(ticker)
        data = stock.history(period="1d")
        if not data.empty:
            latest_price = data['Close'].iloc[-1]
            return f"The current stock price of {ticker} is ${latest_price:.2f}."
        else:
            return f"Unable to retrieve the current stock price for {ticker}."
    except Exception as e:
        logger.error(f"Error retrieving stock price for {ticker}: {str(e)}")
        return f"Unable to retrieve the current stock price for {ticker}."

@app.route('/api/chat', methods=['POST'])
def chat():
    message = request.json['message']
    logger.info(f"Processing message: {message}")

    # Check if the message is asking for stock news
    news_query = re.search(r'(news|information)\s+(?:about|on|for)\s+([A-Za-z\s]+)', message.lower())
    # Check if the message is asking for stock price
    price_query = re.search(r'(?:price|stock)\s+(?:of|for)?\s*([A-Za-z\s]+)', message.lower())

    if news_query:
        company = news_query.group(2).strip()
        response = get_stock_news(company)
        logger.info(f"Stock news response: {response}")
    elif price_query:
        company_or_ticker = price_query.group(1).strip().lower()
        ticker = company_to_ticker.get(company_or_ticker, company_or_ticker.upper())
        logger.info(f"Fetching stock price for ticker: {ticker}")
        response = get_stock_price(ticker)
        logger.info(f"Stock price response: {response}")
    else:
        try:
            # Use AI for other queries
            ai_response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": message}]
            )
            response = ai_response.choices[0].message.content
            logger.info(f"AI response: {response}")
        except Exception as e:
            logger.error(f"Error processing request: {str(e)}")
            response = "I'm sorry, but I encountered an error while processing your request."

    return jsonify({"response": response})

@app.route('/api/hello')
def hello():
    return {'message': 'Hello from Flask!'}

if __name__ == '__main__':
    app.run(debug=True, port=5000)