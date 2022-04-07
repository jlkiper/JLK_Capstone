import bs4
from urllib.request import urlopen as uReq
from bs4 import BeautifulSoup as soup

url = 'https://www.midtowncomics.com/search?cat=All%20Comics&scat=DC'

# Opening up connection, grabbing the page
uClient = uReq(url)

# Uploads content into a variable
page_html = uClient.read()

# Close connection
uClient.close()

# HTML Parsing
page_soup = soup(page_html, "html.parser")

# Grabs each product
containers = page_soup.findAll("div",{"class":"product-card row list-style"})

for container in containers:
    title = container.h3
    print(title)