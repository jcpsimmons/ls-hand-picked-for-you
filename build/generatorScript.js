"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var undefinedChecker = function undefinedChecker(query) {
  if (typeof query == "undefined") {
    return false;
  } else {
    return true;
  }
};

var Store =
/*#__PURE__*/
function () {
  function Store(utag_data) {
    _classCallCheck(this, Store);

    this.randomizer = Math.floor(Math.random() * 3 + 1) * 4;

    try {
      this.searchTerms = undefinedChecker(utag_data["cp.lsf-search-term"]) ? utag_data["cp.lsf-search-term"].split(",") : [];
      this.searchWords = undefinedChecker(utag_data["cp.lsf-search-term"]) ? utag_data["cp.lsf-search-term"].split(/,| /) : [];
      this.likedItems = undefinedChecker(utag_data["cp.lsf-liked-items"]) ? JSON.parse(utag_data["cp.lsf-liked-items"]) : [];
      this.viewedItems = undefinedChecker(utag_data["cp.lsf-recently-viewed-list"]) ? JSON.parse(utag_data["cp.lsf-recently-viewed-list"]) : [];
      this.cartAdds = undefinedChecker(utag_data["cp.lsf-cartadds"]) ? utag_data["cp.lsf-cartadds"].split(",") : [];
      var colors = ["black", "brown", "tan", "red", "orange", "yellow", "green", "blue", "purple", "violet"];
      this.searchColors = this.searchWords.filter(function (term) {
        return colors.includes(term);
      });

      if (this.searchTerms.length + this.searchWords.length + this.searchTerms.length + this.viewedItems.length + this.likedItems.length + this.cartAdds.length < 3 || _typeof(this.searchTerms.length) + this.searchWords.length + this.searchTerms.length + this.viewedItems.length + this.likedItems.length + this.cartAdds.length === "undefined") {
        this.eligibility = false;
      } else {
        this.eligibility = true;
      }
    } catch (e) {
      console.log(e);
      this.eligibility = false;
    }
  }

  _createClass(Store, [{
    key: "generateRestfulProductsData",
    value: function generateRestfulProductsData() {
      var fillwords, queryArr, queryString, response, data, wordProbz;
      return regeneratorRuntime.async(function generateRestfulProductsData$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              fillwords = ["boasts", "shouldn", "include", "additional", "unbeatable", "unbelievable", "value", "doesn", "finish", "piece", "design", "style", "construction", "solid", "panel", "which", "while", "facing", "order", "extra", "program", "through", "special", "receive", "ensure", "addition", "tailored", "available", "right", "price", "offered", "mention", "there", "could", "would", "welcome", "select", "select", "favorite", "these", "boast", "provide", "meant", "yourself", "lunch", "dinner", "create", "experience", "device", "developed", "convenient"];
              this.apiData = {};
              this.titleCorpus = [];
              queryArr = [];
              queryString = queryArr.concat(this.likedItems, this.viewedItems, this.cartAdds).map(function (item) {
                if (item.search("cv") > 0) {
                  return item.split("cv")[0];
                } else {
                  return item;
                }
              }).slice(0, 100).join(",");
              queryString = "https://www.livingspaces.com/api/restfulproducts?pid=" + queryString;
              _context.next = 8;
              return regeneratorRuntime.awrap(fetch(queryString));

            case 8:
              response = _context.sent;
              _context.next = 11;
              return regeneratorRuntime.awrap(response.json());

            case 11:
              data = _context.sent;
              this.rawData = data.products;

              for (i = 0; i < this.rawData.length; i++) {
                this.apiData[this.rawData[i].pid] = this.rawData[i];
                this.titleCorpus.push(this.rawData[i].title);
                this.titleCorpus.push(this.rawData[i].romanceCopy);
              }

              this.titleCorpus = this.titleCorpus.join(" ").toLowerCase().replace("  ", " ").replace(/\d+/g, "").replace(/\W/g, " ").split(" ");
              wordProbz = {};
              this.titleCorpus.forEach(function (key) {
                if (key.length > 4 && !key.endsWith("y") && !key.endsWith("ing") && !key.endsWith("s") && fillwords.indexOf(key) == -1) {
                  if (wordProbz.hasOwnProperty(key)) {
                    wordProbz[key]++;
                  } else {
                    wordProbz[key] = 1;
                  }
                }
              });
              this.titleCorpus = wordProbz; // console.log("API queried");

              this.titleCorpusSorted = Object.keys(wordProbz).sort(function (a, b) {
                return wordProbz[b] - wordProbz[a];
              });
              return _context.abrupt("return", true);

            case 20:
            case "end":
              return _context.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "titleCase",
    value: function titleCase(str) {
      str = str.toLowerCase().split(" ");
      var _final = [];

      for (i = 0; i < str.length; i++) {
        _final.push(str[i].charAt(0).toUpperCase() + str[i].slice(1));
      }

      return _final.join(" ");
    }
  }, {
    key: "getRelatedProducts",
    value: function getRelatedProducts() {
      var bloomreachQueryLink, response, data;
      return regeneratorRuntime.async(function getRelatedProducts$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              this.relatedItems = {};
              i = this.randomizer;

            case 2:
              if (!(i < this.titleCorpusSorted.length)) {
                _context2.next = 15;
                break;
              }

              if (!(Object.keys(this.relatedItems).length < 3)) {
                _context2.next = 12;
                break;
              }

              bloomreachQueryLink = "https://brm-core-0.brsrvr.com/api/v1/core/?account_id=5221&auth_key=o5xlkgn7my5fmr5c&domain_key=livingspaces_com&request_id=fd8d6a02a5764b7995c600e766a38bda&url=%2fbr-checker&_br_uid_2=uid%253D4961390647524%253Av%253D11.8%253Ats%253D1463613117510%253Ahc%253D3145&ptype=other&request_type=search&q=".concat(this.titleCorpusSorted[i], "&start=0&rows=4&search_type=keyword&fl=title,pid,url,price,sale_price,reviews,reviews_count,thumb_image");
              _context2.next = 7;
              return regeneratorRuntime.awrap(fetch(bloomreachQueryLink));

            case 7:
              response = _context2.sent;
              _context2.next = 10;
              return regeneratorRuntime.awrap(response.json());

            case 10:
              data = _context2.sent;

              if (data.response.numFound > 3) {
                this.relatedItems[this.titleCorpusSorted[i]] = data.response.docs;
              }

            case 12:
              i++;
              _context2.next = 2;
              break;

            case 15:
            case "end":
              return _context2.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "getBestSellers",
    value: function getBestSellers() {
      var bloomreachQueryLink, response, data, chunk;
      return regeneratorRuntime.async(function getBestSellers$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              this.bestSellers = [];
              bloomreachQueryLink = "https://brm-core-0.brsrvr.com/api/v1/core/?account_id=5221&auth_key=o5xlkgn7my5fmr5c&domain_key=livingspaces_com&request_id=fd8d6a02a5764b7995c600e766a38bda&url=%2fbr-checker&request_type=search&q=best+sellers&start=".concat(this.randomizer.toString(), "&rows=12&search_type=keyword&fl=title,pid,url,price,sale_price,reviews,reviews_count,thumb_image");
              _context3.next = 4;
              return regeneratorRuntime.awrap(fetch(bloomreachQueryLink));

            case 4:
              response = _context3.sent;
              _context3.next = 7;
              return regeneratorRuntime.awrap(response.json());

            case 7:
              data = _context3.sent;

              while (data.response.docs.length > 0) {
                chunk = data.response.docs.splice(0, 4);
                this.bestSellers.push(chunk);
              }

            case 9:
            case "end":
              return _context3.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "getRecentItems",
    value: function getRecentItems() {
      var makeDateString, today, twoMonthsAgo, reqUrl, response, data;
      return regeneratorRuntime.async(function getRecentItems$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              makeDateString = function _ref(d) {
                month = (d.getMonth() + 1).toString();

                if (month.length == 1) {
                  month = "0" + month;
                }

                d = [d.getFullYear(), month, d.getDate()];
                d = d.map(function (item) {
                  return item.toString();
                }).join("");
                return d;
              };

              today = new Date();
              today = makeDateString(today);
              twoMonthsAgo = new Date();
              twoMonthsAgo.setDate(twoMonthsAgo.getDate() - 60);
              twoMonthsAgo = makeDateString(twoMonthsAgo);
              reqUrl = "http://brm-core-0.brsrvr.com/api/v1/core/?account_id=5221&auth_key=o5xlkgn7my5fmr5c&domain_key=livingspaces_com&ptype=category&request_type=search&search_type=keyword&request_id=5bf4c900-a069-414a-abc0-cf5d78ea6868&url=https%3a%2f%2fwww.livingspaces.com%2fdepartments%2ffeatured%2fnew-arrivals&_br_uid_2=uid%3D4490539570488%3Av%3D12.0%3Ats%3D1561674361031%3Ahc%3D1377&q=&start=0&rows=4&fl=pid%2cskuid%2cbrand%2cdescription%2claunch_date%2cclearance%2ccrumbs%2cprice%2cthumb_image%2curl%2ctitle%2cinStockQuantity%2csku_thum_images&fq=launch_date_order:%5b".concat(twoMonthsAgo, "+TO+").concat(today, "%5d");
              _context4.next = 9;
              return regeneratorRuntime.awrap(fetch(reqUrl));

            case 9:
              response = _context4.sent;
              _context4.next = 12;
              return regeneratorRuntime.awrap(response.json());

            case 12:
              data = _context4.sent;

            case 13:
            case "end":
              return _context4.stop();
          }
        }
      });
    }
  }, {
    key: "generateLinks",
    value: function generateLinks() {
      var sectionLength = 0;

      if (this.titleCorpusSorted.length > 20) {
        sectionLength = 30;
      } else {
        sectionLength = this.titleCorpusSorted.length;
      }

      this.searchLinks = [];

      if (this.titleCorpusSorted.length > sectionLength) {
        var arr = this.titleCorpusSorted;
        arr.splice(sectionLength, arr.length);
        this.searchLinks = arr.map(function (item) {
          return "<li><a href=\"https://www.livingspaces.com/search?term=".concat(item, "\" title=\"").concat(item, "\">").concat(item.replace(/^\w/, function (c) {
            return c.toUpperCase();
          }), "</a></li>");
        });
        this.searchLinks = this.searchLinks.join("");
      }
    }
  }, {
    key: "generateHtml",
    value: function generateHtml() {
      this.itemHtml = [];

      if (this.relatedItems) {
        for (var key in this.relatedItems) {
          if (this.relatedItems.hasOwnProperty(key)) {
            this.itemHtml.push(this.relatedItems[key].map(function (item) {
              return "<div class='col-xs-6 col-md-3'><a href='https://www.livingspaces.com/".concat(item.pid, "'><img class='img-responsive' src='").concat(item.thumb_image, "' alt='").concat(item.title, "'><p class='item-text'>").concat(item.title, "</p><p class='price-text'>$").concat(item.sale_price, "</p></a></div>");
            }));
          }
        }
      } else {
        for (i = 0; i < this.bestSellers.length; i++) {
          this.itemHtml.push(this.bestSellers[i].map(function (item) {
            return "<div class='col-xs-6 col-md-3'><a href='https://www.livingspaces.com/".concat(item.pid, "'><img class='img-responsive' src='").concat(item.thumb_image, "' alt='").concat(item.title, "'><p class='item-text'>").concat(item.title, "</p><p class='price-text'>$").concat(item.sale_price, "</p></a></div>");
          }));
        }
      }

      for (var i = 0; i < this.itemHtml.length; i++) {
        // Bootstrap Clearfix
        this.itemHtml[i].splice(2, 0, "<div class='clearfix'></div>");
        this.itemHtml[i] = this.itemHtml[i].join("");
      }
    }
  }]);

  return Store;
}(); // Loading Graphic Logic


function loadingState(bool) {
  if (bool) {
    document.getElementById("loadingSpinner").style.display = "block";
    document.getElementById("productsArea").style.display = "none";
  } else {
    document.getElementById("loadingSpinner").style.display = "none";
    document.getElementById("productsArea").style.display = "block";
    $(".product-slider").css("display", "block");
    $(".product-slider").addClass("fadeInFast");
    $(".placeholder-image").css("display", "none");
    $("html, body").animate({
      scrollTop: $("#BannerArea").offset().top
    }, 500, "linear");
  }
} // Holder function for Async success


function containerFcn() {
  return regeneratorRuntime.async(function containerFcn$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          loadingState(true);
          x = new Store(utag_data);
          console.log("eligible " + x.eligibility.toString());

          if (!x.eligibility) {
            _context5.next = 11;
            break;
          }

          _context5.next = 6;
          return regeneratorRuntime.awrap(x.generateRestfulProductsData());

        case 6:
          _context5.next = 8;
          return regeneratorRuntime.awrap(x.getRelatedProducts());

        case 8:
          x.generateLinks();
          _context5.next = 13;
          break;

        case 11:
          _context5.next = 13;
          return regeneratorRuntime.awrap(x.getBestSellers());

        case 13:
          x.generateHtml();
          document.getElementById("RelatedToItemsYouveViewed").innerHTML = x.itemHtml[0];
          document.getElementById("MoreItemsToConsider").innerHTML = x.itemHtml[1];
          document.getElementById("BasedOnYourRecentHistory").innerHTML = x.itemHtml[2];

          if (x.searchLinks == "undefined" || typeof x.searchLinks == "undefined") {
            document.getElementById("RelatedLinksContainer").style.display = "none";
            document.getElementById("RelatedItemsTitle").style.display = "none";
          } else {
            document.getElementById("RelatedLinks").innerHTML = x.searchLinks;
          }

          loadingState(false);

        case 19:
        case "end":
          return _context5.stop();
      }
    }
  });
} // handler interval, slick init


var anotherInterval = setInterval(function () {
  if (typeof utag !== "undefined" && typeof window.jQuery !== "undefined") {
    clearInterval(anotherInterval);

    if (utag_data.site_type == "desktop") {
      $(".product-slider").slick({
        infinite: true,
        slidesToShow: 5,
        centerMode: true,
        slidesToScroll: 1,
        arrows: false,
        autoplay: true,
        autoplaySpeed: 2000
      });
    } else {
      $(".product-slider").slick({
        infinite: true,
        slidesToShow: 2.5,
        slidesToScroll: 1,
        arrows: false,
        autoplay: true,
        autoplaySpeed: 2000
      });
    }

    containerFcn();
  }
}, 4000);