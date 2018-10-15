import $ from 'jquery';

import './styles/main.scss';


class TopStories {
  constructor(element) {
    this.$element = $(element);
    this.activeArticleIndex = 0;
    this.fetchTopStories();
    this.addEvents();
  }

  addEvents() {
    const self = this;

    self.$element.on('click', '.news-box__body__side-navigation__item', function() {
      const $element = $(this);

      self.handleNavigationItemClick.call(self, $element);
    });

    $(window).on('resize', () => {
      self.setImageStyle.call(self);
    });
  }

  handleNavigationItemClick($element) {
    this.activeArticleIndex = $element.index();

    this.setActiveArticle(this.activeArticleIndex);
  }

  fetchTopStories() {
    this.handleRequestPending();

    fetch('http://api.nytimes.com/svc/topstories/v2/theater.json?api-key=647f12c37d1048218f1e8b5d62d54fa8')
      .then(res => res.json())
      .then(data => this.handleRequestSuccess(data))
      .catch(this.handleRequestFail)
      ;
  }

  handleRequestPending() {
    const $container = $('<div />')
      .attr({
        'class': 'news-box--state-pending',
      })
      .html(`<span>Loading...</span>`)
      ;

    this.$element.append($container);
  }

  handleRequestSuccess(data) {
    $('.news-box--state-pending').remove();
    this.addElements(data.results);
    this.setActiveArticle(0);
  }

  handleRequestFail() {
    const $container = $('<div />')
      .attr({
        'class': 'news-box--state-failed',
      })
      .html(`<span>Couldn't retrieve Top Stories</span>`)
      ;

    $('.news-box').append($container);
  }

  createHeader() {
    const $newsBoxHeader = $('<div />')
      .attr({
        'class': 'news-box__header',
      })
      .html(`<h1>Top Stories</h1>`)
      ;

    return $newsBoxHeader;
  }

  createNavigationItems(list) {
    const $newsBoxSideNavigation = $('<div />')
      .attr({
        'class': 'news-box__body__side-navigation',
      })
      ;


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
    return $newsBoxSideNavigation;
  }

  createArticleImages(list) {
    const $newsBoxImages = $('<div />')
      .attr({
        'class': 'news-box__body__images',
      })
      ;

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
    return $newsBoxImages;
  }

  addElements(list) {
    const $header = this.createHeader();
    const $images = this.createArticleImages(list);
    const $navItems = this.createNavigationItems(list);

    const $newsBoxBody = $('<div />')
      .attr({
        'class': 'news-box__body',
      })
      ;

    this.$element.append($newsBoxBody);
    this.$element.prepend($header);
    $newsBoxBody.append([ $images, $navItems ]);
  }

  setImageStyle() {
    const $newsBoxSideNavigation = $('.news-box__body__side-navigation');
    const navigationBarHeight = $newsBoxSideNavigation.height();
    const $images = $('.news-box__body__images').children();

    $images.css({
      height: `${navigationBarHeight}px`,
    })
    ;
  }


  setActiveStateStyle(element, className) {
    element.addClass(className);
    element.siblings().removeClass(className);
  }

  setActiveImage(index) {
    const $images = $('.news-box__body__images__item');
    const $activeImage = $images.eq(index);

    this.setImageStyle();
    this.setActiveStateStyle($activeImage, 'news-box__body__images__item--state-active');
  }

  setActiveNavigationItem(index) {
    const $navigationItems = $('.news-box__body__side-navigation__item');
    const $activeNavigationItem = $navigationItems.eq(index);

    this.setActiveStateStyle($activeNavigationItem, 'news-box__body__side-navigation__item--state-active');
  }

  setActiveArticle(index) {
    this.setActiveNavigationItem(index);
    this.setActiveImage(index);
  }
}

$.fn.TopStories = function() {
  this.each((index, element) => {
    new TopStories(element);
  });
}

$('.news-box').TopStories();
