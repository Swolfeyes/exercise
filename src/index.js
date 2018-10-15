import $ from 'jquery';

import './styles/main.scss';

const $newsBox = $('.news-box');

const $newsBoxBody = $('<div />')
  .attr({
    'class': 'news-box__body',
  })
  ;


$newsBox.append($newsBoxBody);

const $newsBoxSideNavigation = $('<div />')
  .attr({
    'class': 'news-box__body__side-navigation',
  })
  ;

const fetchTopStories = () => {
  fetch('http://api.nytimes.com/svc/topstories/v2/theater.json?api-key=647f12c37d1048218f1e8b5d62d54fa8')
    .then(res => res.json())
    .then(data => handleRequestSuccess(data))
    .catch(handleRequestFail)
    ;
}

const handleRequestSuccess = (data) => {
  createNewsBox(data.results);
  setActiveArticle(0);
}

const handleRequestFail = () => {
  const $container = $('<div />')
    .attr({
      'class': 'news-box--state-failed',
    })
    .html(`<span>Couldn't retrieve Top Stories</span>`)
    ;

  $newsBox.append($container);
}


const handleNavigationItemClick = (event) => {
  const activeArticleIndex = $(event.currentTarget).index();

  setActiveArticle(activeArticleIndex);
}

const addEvents = () => {
  $newsBoxSideNavigation.on('click', '.news-box__body__side-navigation__item', handleNavigationItemClick);
  $(window).on('resize', () => setImageStyle());
}

const createHeader = () => {
  const $newsBoxHeader = $('<div />')
    .attr({
      'class': 'news-box__header',
    })
    .html(`<h1>Top Stories</h1>`)
    ;

  $newsBox.prepend($newsBoxHeader);
}

const createNavigationItems = (list) => {
  $newsBoxBody.append($newsBoxSideNavigation);

  const reducedList = list.slice(0, 4);

  const navigationItems = reducedList.map((item) => {

    const $navItem = $('<div />')
      .attr({
        'class': 'news-box__body__side-navigation__item',
      })
      ;

    const $title = $('<div />')
      .attr({
        'class': 'news-box__body__side-navigation__item__title',
      })
      .html(`<h2>${item.title}</h2>`)
      ;

    const $details = $('<div />')
      .attr({
        'class': 'news-box__body__side-navigation__item__details'
      })
      ;

    const $abstract = $('<div />')
      .attr({
        'class': 'news-box__body__side-navigation__item__details__abstract',
      })
      .html(`<p>${item.abstract}</p>`)
      ;

    const $link = $('<div />')
      .attr({
        'class': 'news-box__body__side-navigation__item__details__link',
      })
      .html(`<a href='${item.url}' target='_blank'><span>Review link</span></a>`)
      ;

      $details.append([ $abstract, $link])
      $navItem.append([ $title, $details ]);
      return $navItem;
  });

  $newsBoxSideNavigation.append(navigationItems);

}

const createArticleImages = (list) => {
  const $newsBoxImages = $('<div />')
    .attr({
      'class': 'news-box__body__images',
    })
    ;

  $newsBoxBody.append($newsBoxImages);

  const reducedList = list.slice(0, 4);

   const imageItems = reducedList.map((item) => {

    const $image = $('<div />')
      .attr({
        'class': 'news-box__body__images__item'
      })
      .html(`<img src=${item.multimedia[4].url} />`)

    return $image;
  });

  $newsBoxImages.append(imageItems);
}

const createNewsBox = (list) => {
  createHeader();
  createNavigationItems(list);
  createArticleImages(list);
  addEvents();
}

const setImageStyle = () => {
  const navigationBarHeight = $newsBoxSideNavigation.height();
  const $images = $('.news-box__body__images').children();

  $images.css({
    height: `${navigationBarHeight}px`,
  })
  ;
}


const setActiveStateStyle = (element, className) => {
  element.addClass(className);
  element.siblings().removeClass(className);
}

const setActiveImage = (index) => {
  const $images = $('.news-box__body__images__item');
  const $activeImage = $images.eq(index);

  setImageStyle();
  setActiveStateStyle($activeImage, 'news-box__body__images__item--state-active');
}

const setActiveNavigationItem = (index) => {
  const $navigationItems = $('.news-box__body__side-navigation__item');
  const $activeNavigationItem = $navigationItems.eq(index);

  setActiveStateStyle($activeNavigationItem, 'news-box__body__side-navigation__item--state-active');
}

const setActiveArticle = (index) => {
  setActiveNavigationItem(index);
  setActiveImage(index);
}

fetchTopStories();
