import requests
import bs4
import os.path
import pickle
from datetime import datetime
import calendar

# creates a file containing the website's soup
def get_soup(filename, website):
    # if file doesn't already exist, create one
    if not os.path.exists(filename):
        res = requests.get(website)
        res.raise_for_status()
        website_file = open(filename, 'wb')
        for chunk in res.iter_content(100000):  # from https://automatetheboringstuff.com/2e/chapter12/
            website_file.write(chunk)
        website_file.close()

    website_file = open(filename)
    return bs4.BeautifulSoup(website_file, 'lxml')


# parse quotes given soup and saves it into a file
def parse_quotes(file_name, soup):
    """
    Parse quotes and returns a list of quotes
    :param soup:
    :return:
    """
    quote_list = []
    # div containing quote list found manually using F12 + finding selector

    # retrieves soup (div) that contains the quotes
    # old selector: #mainApp > div > div > div:nth-child(2) > div > div:nth-child(2) > div > div > div > div > div.ArticleFrame__articleContainer__2HV3L.container > div.row > div.article-body.col-md-8.offset-md-0.col-lg-8.offset-lg-1 > div > div.offset-md-0.offset-lg-1
    selector = '#mainArticleWrapper > div:nth-child(1) > div > div.ArticleGrid__feedContainer__BSOXe > div:nth-child(2) > article > article > div.ModernArticleBody__cleanBodyText__sNffF.article-body'
    quote_soup = bs4.BeautifulSoup(str(soup.select(selector)), 'lxml')

    # gives the quotes
    results = quote_soup.find_all("div", {"class": "standardText"})
    for result in results:
        if result.text[0] == "\"":
            quote_list.append(result.text)

    if (len(quote_list) != 366):
        print("Quotes not found")
        # error check if quotes not found using selector
        return

    with open(file_name, 'wb') as f:
        pickle.dump(quote_list, f)


def main():
    # string constants
    website = ("https://www.inc.com/bill-murphy-jr/"
           "366-top-inspirational-quotes-motivational-quotes-"
           "for-every-single-day-in-2020.html")
    file_name = 'website.txt'
    quote_file = 'quotes.txt'

    # check if file of quotes exists
    if not os.path.exists(quote_file):
        soup = get_soup(file_name, website)
        parse_quotes(quote_file, soup)

    with open(quote_file, 'rb') as f:
        quote_list = pickle.load(f)

    day_of_year = datetime.now().timetuple().tm_yday - 1
    day = datetime.today()
    # print quote here
    print(f"{calendar.day_name[day.weekday()]}, {calendar.month_name[day.month]} {day.day}, {day.year}")
    print(quote_list[day_of_year])
    input("Press enter to exit")  # to stop it from closing straight away


if __name__ == "__main__":
    main()
