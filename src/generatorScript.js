import "@babel/polyfill";

const undefinedChecker = query => {
  if (typeof query == "undefined") {
    return false;
  } else {
    return true;
  }
};

class Store {
  constructor(utag_data) {
    this.randomizer = Math.floor(Math.random() * 3 + 1) * 4;
    try {
      this.searchTerms = undefinedChecker(utag_data["cp.lsf-search-term"])
        ? utag_data["cp.lsf-search-term"].split(",")
        : [];
      this.searchWords = undefinedChecker(utag_data["cp.lsf-search-term"])
        ? utag_data["cp.lsf-search-term"].split(/,| /)
        : [];
      this.likedItems = undefinedChecker(utag_data["cp.lsf-liked-items"])
        ? JSON.parse(utag_data["cp.lsf-liked-items"])
        : [];
      this.viewedItems = undefinedChecker(
        utag_data["cp.lsf-recently-viewed-list"]
      )
        ? JSON.parse(utag_data["cp.lsf-recently-viewed-list"])
        : [];
      this.cartAdds = undefinedChecker(utag_data["cp.lsf-cartadds"])
        ? utag_data["cp.lsf-cartadds"].split(",")
        : [];
      let colors = [
        "black",
        "brown",
        "tan",
        "red",
        "orange",
        "yellow",
        "green",
        "blue",
        "purple",
        "violet"
      ];
      this.searchColors = this.searchWords.filter(term => {
        return colors.includes(term);
      });
      if (
        this.searchTerms.length +
          this.searchWords.length +
          this.searchTerms.length +
          this.viewedItems.length +
          this.likedItems.length +
          this.cartAdds.length <
          3 ||
        typeof this.searchTerms.length +
          this.searchWords.length +
          this.searchTerms.length +
          this.viewedItems.length +
          this.likedItems.length +
          this.cartAdds.length ===
          "undefined"
      ) {
        this.eligibility = false;
      } else {
        this.eligibility = true;
      }
    } catch (e) {
      console.log(e);
      this.eligibility = false;
    }
  }

  async generateRestfulProductsData() {
    let fillwords = [
      "boasts",
      "shouldn",
      "include",
      "additional",
      "unbeatable",
      "unbelievable",
      "value",
      "doesn",
      "finish",
      "piece",
      "design",
      "style",
      "construction",
      "solid",
      "panel",
      "which",
      "while",
      "facing",
      "order",
      "extra",
      "program",
      "through",
      "special",
      "receive",
      "ensure",
      "addition",
      "tailored",
      "available",
      "right",
      "price",
      "offered",
      "mention",
      "there",
      "could",
      "would",
      "welcome",
      "select",
      "select",
      "favorite",
      "these",
      "boast",
      "provide",
      "meant",
      "yourself",
      "lunch",
      "dinner",
      "create",
      "experience",
      "device",
      "developed",
      "convenient"
    ];
    this.apiData = {};
    this.titleCorpus = [];
    let queryArr = [];
    let queryString = queryArr
      .concat(this.likedItems, this.viewedItems, this.cartAdds)
      .map(item => {
        if (item.search("cv") > 0) {
          return item.split("cv")[0];
        } else {
          return item;
        }
      })
      .slice(0, 100)
      .join(",");
    queryString =
      "https://www.livingspaces.com/api/restfulproducts?pid=" + queryString;
    let response = await fetch(queryString);
    let data = await response.json();
    this.rawData = data.products;
    for (i = 0; i < this.rawData.length; i++) {
      this.apiData[this.rawData[i].pid] = this.rawData[i];
      this.titleCorpus.push(this.rawData[i].title);
      this.titleCorpus.push(this.rawData[i].romanceCopy);
    }
    this.titleCorpus = this.titleCorpus
      .join(" ")
      .toLowerCase()
      .replace("  ", " ")
      .replace(/\d+/g, "")
      .replace(/\W/g, " ")
      .split(" ");
    let wordProbz = {};
    this.titleCorpus.forEach(key => {
      if (
        key.length > 4 &&
        !key.endsWith("y") &&
        !key.endsWith("ing") &&
        !key.endsWith("s") &&
        fillwords.indexOf(key) == -1
      ) {
        if (wordProbz.hasOwnProperty(key)) {
          wordProbz[key]++;
        } else {
          wordProbz[key] = 1;
        }
      }
    });
    this.titleCorpus = wordProbz;
    // console.log("API queried");
    this.titleCorpusSorted = Object.keys(wordProbz).sort(function(a, b) {
      return wordProbz[b] - wordProbz[a];
    });
    return true;
  }

  titleCase(str) {
    str = str.toLowerCase().split(" ");
    var final = [];
    for (i = 0; i < str.length; i++) {
      final.push(str[i].charAt(0).toUpperCase() + str[i].slice(1));
    }
    return final.join(" ");
  }

  async getRelatedProducts() {
    this.relatedItems = {};
    for (i = this.randomizer; i < this.titleCorpusSorted.length; i++) {
      if (Object.keys(this.relatedItems).length < 3) {
        let bloomreachQueryLink = `https://brm-core-0.brsrvr.com/api/v1/core/?account_id=5221&auth_key=o5xlkgn7my5fmr5c&domain_key=livingspaces_com&request_id=fd8d6a02a5764b7995c600e766a38bda&url=%2fbr-checker&_br_uid_2=uid%253D4961390647524%253Av%253D11.8%253Ats%253D1463613117510%253Ahc%253D3145&ptype=other&request_type=search&q=${this.titleCorpusSorted[i]}&start=0&rows=4&search_type=keyword&fl=title,pid,url,price,sale_price,reviews,reviews_count,thumb_image`;
        let response = await fetch(bloomreachQueryLink);
        let data = await response.json();
        if (data.response.numFound > 3) {
          this.relatedItems[this.titleCorpusSorted[i]] = data.response.docs;
        }
      }
    }
  }

  async getBestSellers() {
    this.bestSellers = [];
    let bloomreachQueryLink =
      'http://brm-core-0.brsrvr.com/api/v1/core/?account_id=5221&auth_key=o5xlkgn7my5fmr5c&domain_key=livingspaces_com&ptype=category&request_type=search&search_type=keyword&request_id=dc16a752-2805-4edb-a5df-4cd4924b93a4&url=https%3a%2f%2fwww.livingspaces.com%2fdepartments%2ffeatured%2fbest-sellers&user_agent=Mozilla%2f5.0+(Macintosh%3b+Intel+Mac+OS+X+10_14_6)+AppleWebKit%2f537.36+(KHTML%2c+like+Gecko)+Chrome%2f78.0.3904.108+Safari%2f537.36&user_ip=10.255.11.252&ref_url=https%3a%2f%2fwww.google.com%2f&_br_uid_2=uid%3D609202342266%3Av%3D12.0%3Ats%3D1576777546756%3Ahc%3D373&q=&start=0&rows=24&fl=pid%2cskuid%2cbrand%2cdescription%2claunch_date%2cclearance%2ccrumbs%2cprice%2cthumb_image%2curl%2ctitle%2cavailability%2ccondition%2ckeywords%2ccolors%2ccolor_groups%2cmaterial%2creviews%2creviews_count%2cwidth%2cheight%2cdepth%2csoConfigure_attribute%2cinStockQuantity%2cadditional_images%2ctotal_number_body_swatches%2crandom_product_swatches%2csale_price%2cpromotions%2csku_thum_images%2cprice_range%2csale_price_range%2cexclude_from_category%2cstyle%2cbase_material&facet.field=product_attribute&facet.field=sizes&facet.field=color_groups&facet.field=f_shape&facet.field=f_material_type&facet.field=soConfigure_attribute&facet.field=style&facet.field=content_attribute&facet.field=f_pattern_type&facet.field=orientation_attribute&facet.field=clearance&facet.field=base_material&facet.field=features&facet.field=sale_price&fq=pid:"92031%22OR%2277107%22OR%2293877%22OR%2274143%22OR%22102674%22OR%22105477%22OR%2281813%22OR%2271767%22OR%2285050%22OR%2294728%22OR%2292474%22OR%22101915%22OR%2299488%22OR%2289893%22OR%2276323%22OR%2286396%22OR%2286732%22OR%2293530%22OR%22101609%22OR%2281484%22OR%2281722%22OR%2285686%22OR%22102776%22OR%22107082%22OR%22107126%22OR%22107025%22OR%22200185%22OR%2279882%22OR%2295039%22OR%2284787%22OR%2291086%22OR%22104834%22OR%2269914%22OR%2286199%22OR%2287327%22OR%22108758%22OR%2282521%22OR%2279884%22OR%2270965%22OR%2277231%22OR%2280547%22OR%2281982%22OR%22102899%22OR%22105249%22OR%22102514%22OR%2279418"&facet.range=sale_price:%5b*+TO+100%5d&facet.range=sale_price:%5b100+TO+200%5d&facet.range=sale_price:%5b200+TO+300%5d&facet.range=sale_price:%5b300+TO+400%5d&facet.range=sale_price:%5b400+TO+*%5d&sort=';
    let response = await fetch(bloomreachQueryLink);
    let data = await response.json();
    while (data.response.docs.length > 0) {
      let chunk = data.response.docs.splice(0, 4);
      this.bestSellers.push(chunk);
    }
  }

  async getRecentItems() {
    // Unfinished method - was going to grab recently released items
    function makeDateString(d) {
      month = (d.getMonth() + 1).toString();
      if (month.length == 1) {
        month = "0" + month;
      }
      d = [d.getFullYear(), month, d.getDate()];
      d = d
        .map(function(item) {
          return item.toString();
        })
        .join("");
      return d;
    }

    let today = new Date();
    today = makeDateString(today);
    let twoMonthsAgo = new Date();
    twoMonthsAgo.setDate(twoMonthsAgo.getDate() - 60);
    twoMonthsAgo = makeDateString(twoMonthsAgo);

    let reqUrl = `http://brm-core-0.brsrvr.com/api/v1/core/?account_id=5221&auth_key=o5xlkgn7my5fmr5c&domain_key=livingspaces_com&ptype=category&request_type=search&search_type=keyword&request_id=5bf4c900-a069-414a-abc0-cf5d78ea6868&url=https%3a%2f%2fwww.livingspaces.com%2fdepartments%2ffeatured%2fnew-arrivals&_br_uid_2=uid%3D4490539570488%3Av%3D12.0%3Ats%3D1561674361031%3Ahc%3D1377&q=&start=0&rows=4&fl=pid%2cskuid%2cbrand%2cdescription%2claunch_date%2cclearance%2ccrumbs%2cprice%2cthumb_image%2curl%2ctitle%2cinStockQuantity%2csku_thum_images&fq=launch_date_order:%5b${twoMonthsAgo}+TO+${today}%5d`;
    let response = await fetch(reqUrl);
    let data = await response.json();
    // STOPPED HERE THURSDAY - get the products data, put into HTML (probably just in this function) and assign it to a this object
  }

  generateLinks() {
    var sectionLength = 0;
    if (this.titleCorpusSorted.length > 20) {
      sectionLength = 30;
    } else {
      sectionLength = this.titleCorpusSorted.length;
    }
    this.searchLinks = [];
    if (this.titleCorpusSorted.length > sectionLength) {
      let arr = this.titleCorpusSorted;
      arr.splice(sectionLength, arr.length);
      this.searchLinks = arr.map(function(item) {
        return `<li><a href="https://www.livingspaces.com/search?term=${item}" title="${item}">${item.replace(/^\w/, c => c.toUpperCase())}</a></li>`;
      });
      this.searchLinks = this.searchLinks.join("");
    }
  }

  generateHtml() {
    this.itemHtml = [];
    if (this.relatedItems) {
      for (var key in this.relatedItems) {
        if (this.relatedItems.hasOwnProperty(key)) {
          this.itemHtml.push(
            this.relatedItems[key].map(function(item) {
              return `<div class='col-xs-6 col-md-3'><a href='https://www.livingspaces.com/${item.pid}'><img class='img-responsive' src='${item.thumb_image}' alt='${item.title}'><p class='item-text'>${item.title}</p><p class='price-text'>$${item.sale_price}</p></a></div>`;
            })
          );
        }
      }
    } else {
      for (i = 0; i < this.bestSellers.length; i++) {
        this.itemHtml.push(
          this.bestSellers[i].map(function(item) {
            return `<div class='col-xs-6 col-md-3'><a href='https://www.livingspaces.com/${item.pid}'><img class='img-responsive' src='${item.thumb_image}' alt='${item.title}'><p class='item-text'>${item.title}</p><p class='price-text'>$${item.sale_price}</p></a></div>`;
          })
        );
      }
    }
    for (var i = 0; i < this.itemHtml.length; i++) {
      // Bootstrap Clearfix
      this.itemHtml[i].splice(2, 0, "<div class='clearfix'></div>");
      this.itemHtml[i] = this.itemHtml[i].join("");
    }
  }
}

// Loading Graphic Logic
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
    $("html, body").animate(
      {
        scrollTop: $("#BannerArea").offset().top
      },
      500,
      "linear"
    );
  }
}

// Holder function for Async success
async function containerFcn() {
  loadingState(true);
  var x = new Store(utag_data);
  console.log("eligible " + x.eligibility.toString());
  if (x.eligibility) {
    await x.generateRestfulProductsData();
    await x.getRelatedProducts();
    x.generateLinks();
  } else {
    await x.getBestSellers();
  }
  x.generateHtml();
  document.getElementById("RelatedToItemsYouveViewed").innerHTML =
    x.itemHtml[0];
  document.getElementById("MoreItemsToConsider").innerHTML = x.itemHtml[1];
  document.getElementById("BasedOnYourRecentHistory").innerHTML = x.itemHtml[2];
  if (x.searchLinks == "undefined" || typeof x.searchLinks == "undefined") {
    document.getElementById("RelatedLinksContainer").style.display = "none";
    document.getElementById("RelatedItemsTitle").style.display = "none";
  } else {
    document.getElementById("RelatedLinks").innerHTML = x.searchLinks;
  }
  loadingState(false);
}

// handler interval, slick init
var anotherInterval = setInterval(function() {
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
