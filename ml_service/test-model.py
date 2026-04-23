from transformers import pipeline

clf = pipeline("text-classification", model="mrm8488/bert-tiny-finetuned-fake-news-detection", tokenizer="mrm8488/bert-tiny-finetuned-fake-news-detection")
print(clf("trump is the president of america"))
print(clf("trump is alive"))
