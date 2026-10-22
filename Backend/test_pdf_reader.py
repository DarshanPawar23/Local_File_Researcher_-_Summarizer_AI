from utils.pdf_reader import read_pdf

text = read_pdf("documents/9a161aaf-8429-4d9f-835d-eea3cc9060a7.pdf")

print(text[:2000])