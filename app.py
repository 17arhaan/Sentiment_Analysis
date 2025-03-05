from flask import Flask, request, render_template_string
from pyspark.sql import SparkSession
from textblob import TextBlob

app = Flask(__name__)

def compute_sentiment(text):
    try:
        return TextBlob(text).sentiment.polarity
    except Exception:
        return 0.0

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        topic = request.form.get('topic')
        if not topic:
            return "Please enter a topic.", 400
        hdfs_path = f"hdfs:///data/{topic}.txt"
        # SparkSession with security manager enabled
        spark = SparkSession.builder \
            .appName("TopicSentimentAnalysis") \
            .config("spark.driver.extraJavaOptions", "-Djava.security.manager") \
            .config("spark.executor.extraJavaOptions", "-Djava.security.manager") \
            .getOrCreate()

        try:
            df = spark.read.text(hdfs_path)
            rdd = df.rdd.map(lambda row: row.value)
            sentiment_rdd = rdd.map(lambda text: (text, compute_sentiment(text)))
            results = sentiment_rdd.collect()
        except Exception as e:
            spark.stop()
            return f"Error processing topic: {e}", 500
        spark.stop()
        html = """
        <h2>Sentiment Analysis for Topic: {{ topic }}</h2>
        <table border="1" cellpadding="5" cellspacing="0">
            <tr>
                <th>Text Segment</th>
                <th>Sentiment Score</th>
            </tr>
            {% for text, sentiment in results %}
            <tr>
                <td>{{ text }}</td>
                <td>{{ sentiment }}</td>
            </tr>
            {% endfor %}
        </table>
        <br>
        <a href="/">Analyze another topic</a>
        """
        return render_template_string(html, topic=topic, results=results)
    return '''
        <h2>Topic Sentiment Analysis</h2>
        <form method="post">
            <label for="topic">Enter Topic:</label>
            <input type="text" id="topic" name="topic" required>
            <br><br>
            <input type="submit" value="Analyze">
        </form>
    '''

if __name__ == '__main__':
    app.run(debug=True)
