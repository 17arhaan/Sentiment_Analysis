from pyspark.sql import SparkSession
from pyspark.sql.functions import udf
from pyspark.sql.types import FloatType
from textblob import TextBlob

def get_sentiment(text):
    try:
        return TextBlob(text).sentiment.polarity
    except Exception:
        return 0.0

spark = SparkSession.builder.appName("SentimentAnalysis").getOrCreate()
input_path = "hdfs:///path/to/input/data.csv"
df = spark.read.csv(input_path, header=True, inferSchema=True)
sentiment_udf = udf(get_sentiment, FloatType())
df_with_sentiment = df.withColumn("sentiment", sentiment_udf(df["text"]))
df_with_sentiment.show(truncate=False)
output_path = "hdfs:///path/to/output/data_with_sentiment.csv"
df_with_sentiment.write.csv(output_path, header=True, mode="overwrite")
spark.stop()
