"use strict"

const API_KEY = "38f6b3ab94ad406db0b847023741dc13";
const API_DOMAIN = 'https://newsapi.org/v2/'

const MAX_PAGE = 8
const PAGE_SIZE = 5

const NO_PHOTO_URL = 'http://classifieds.parkrecord.com/public/images/no-photo.png'

let current_page = 1
let curr_source = 'none'
let curr_text = ''


function renderNewsItem(article) {
   let item = document.createElement('div')
   item.className = "news__item"

   let card = document.createElement('div')
   card.className = "news__item__card"

   let img = document.createElement('img')
   img.setAttribute("src", article.urlToImage == null ? NO_PHOTO_URL : article.urlToImage)
   img.setAttribute("alt", article.title)
   card.appendChild(img)

   let capt = document.createElement('div')
   capt.className = "news__item__caption"

   let captMiddle = document.createElement('div')
   captMiddle.className = "news-middle"
   capt.appendChild(captMiddle)

   let author = document.createElement('h4')
   author.textContent = article.author == null ? article.source.name : article.author
   captMiddle.appendChild(author)

   let time = document.createElement('p')
   time.textContent = article.publishedAt
   captMiddle.appendChild(time)

   card.appendChild(capt)
   item.appendChild(card)

   let cont = document.createElement('div')
   cont.className = "news__description"

   let title = document.createElement('h2')
   title.textContent = article.title
   cont.appendChild(title)

   let text = document.createElement('p')
   text.textContent = article.content
   cont.appendChild(text)

   let source = document.createElement('div')
   source.className = 'news__source'
   source.textContent = article.source.name
   if(source.textContent.length > 12) {
      source.style.fontSize = "11px"
   }
   cont.appendChild(source)

   item.appendChild(cont)

   item.onclick = function() {
      window.open(article.url, '_blank');
   }

   return item;
}

function fillSources() {
   let url = API_DOMAIN + 'sources?' +
          'country=us&' +
          'language=en&' +
          'apiKey=' + API_KEY

   let req = new Request(url)
   fetch(req).then((response) => response.json())
      .then((json) => {
      let select = document.getElementById("search__source");

      if(json.status) {
         let sources = json.sources
         sources.forEach((source) => {
            let el = document.createElement("option")
            el.textContent = source.name
            el.value = source.id
            select.appendChild(el)
         })
      }
   })
}

function fillNews() {
   let url = API_DOMAIN + 'top-headlines?' +
          'language=en&' +
          'apiKey=' + API_KEY + "&" +
          'page=' + current_page++ + '&' +
          'pageSize=' + PAGE_SIZE

   if(curr_text != '') {
      url += '&q=' + curr_text
   }

   if(curr_source != 'none') {
      url += '&sources=' + curr_source
   }

   let req = new Request(url)
   fetch(req).then((response) => response.json())
      .then((json) => {
      let news = document.getElementById('news')

      let articles = json.articles
      if(json.status) {
         articles.forEach((article) => {
           news.appendChild(renderNewsItem(article))
         })

         if(articles.length == 0 || current_page == MAX_PAGE + 1) {
            let news = document.getElementById('next-news')
            news.style.display = 'none'
         }

         if(articles.length == 0 && current_page == 2) {
            let news = document.getElementById('news')

            if(news.innerHTML == '') {
               news.innerHTML = 'There are no articles matching your request'
            }
         }
      }
   })
}

function makeSearch() {
   let news = document.getElementById('news')
   news.innerHTML = ''

   current_page = 1

   curr_source = document.getElementById('search__source').value
   curr_text = document.getElementById('search__input').value

   fillNews()
}

let news = document.getElementById('next-news')
news.onclick = function() {
   fillNews()
}

let newsInput = document.getElementById('search__input')
newsInput.onkeypress = function(e) {
   if (e.which == 13) {
      makeSearch()
   }
}

let searchButton = document.getElementById('search__button')
searchButton.onclick = function() {
   makeSearch()
}

fillNews()
fillSources()
