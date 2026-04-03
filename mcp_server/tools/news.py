import requests

API_KEY = "pub_de5f956eb1104c408df21e826752ab00"

def get_news(topic: str):
    try:
        url = f"https://newsdata.io/api/1/news?apikey={API_KEY}&q={topic}&language=en"
        
        res = requests.get(url).json()

        articles = res.get("results", [])[:3]

        if not articles:
            return "No news found"

        news_list = []
        for article in articles:
            news_list.append(f"- {article['title']}")

        return "\n".join(news_list)

    except Exception as e:
        return f"Error fetching news: {str(e)}"