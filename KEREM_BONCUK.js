/* 
Hello I am Kerem Boncuk, senior student at Sabanci University. Below is the task related to ebebek website. 
It prepends a new pixel perfect carousel "Beğenebileceğinizi düşündüklerimiz" to the website.
You can try out the code by going to https://www.e-bebek.com/ and copy pasting the code to the browser console.
Note: I kept the comments long in order to explain you my reasoning in more detail, I hope you consider me one of valuable candidates, Thank you
*/
(() => {
  // Check if we are on the ebebek homepage site.
  // If we are not on that page we console.log "wrong page" and not even run the script
  // It is important to do so because we will download jQuerry sime sites dont allow downloading scripts and it gives error so first of all we if we are on the correct site
  if (
    window.location.hostname !== "www.e-bebek.com" ||
    window.location.pathname !== "/"
  ) {
    console.log("wrong page");
    return;
  }

  //This is the main of the script. It fetches the data (either from url or if it is present in the localStorage from there), then it buildHTML, buildCSS and setEvents.
  const init = () => {
    buildHTML();

    const storedProducts = localStorage.getItem("carousel_products");
    const jsonUrl =
      "https://gist.githubusercontent.com/sevindi/8bcbde9f02c1d4abe112809c974e1f49/raw/9bf93b58df623a9b16f1db721cd0a7a539296cf0/products.json";

    if (storedProducts) {
      console.log("Products loaded from Local Storage.");
      buildCarousel(JSON.parse(storedProducts));
    } else {
      fetch(jsonUrl)
        .then((response) => response.json())
        .then((products) => {
          localStorage.setItem("carousel_products", JSON.stringify(products));
          buildCarousel(products);
        })
        .catch((error) => console.error(`Error getting the data: `, error));
    }
  };


  const buildHTML = () => {
    // This is the place it needs the carousel to be inserted. I checked here from browser devtools in order to find here.
    const carouselPlace = "eb-root cx-storefront cx-page-layout cx-page-slot.Section2A.has-components";

    const root = document.createElement("div");
    root.id = "custom-carousel-root";
    $(carouselPlace).prepend(root);
  };

  // This is the css being used in the htmls.
  // I used "carouselId" incase that the script is run twic each carousel will have its own id so that the events do not mix up with each other.
  const buildCSS = (carouselId) => {
    const css = `
      
      #${carouselId} .owl-stage {
        display: flex;
        transform: translateX(0);
        transition: transform 0.5s ease;
        will-change: transform;
      }

      #${carouselId} .owl-item {
        width: 242px;
        margin-right: 20px;
        flex: 0 0 auto; /* prevent shrinking */
      }

      #${carouselId} .heart.is-favorited {
        background-color: orange;
      }

      #${carouselId} .product-item-content .add-to-cart-btn {
        width: 100%;
        margin-top: 10px;
        background-color: #fff7e6;
        border-radius: 20px;
        border: 1px solid #ffc;
        color: #f28e00;
        padding: 10px;
        font-weight: bold;
      }
    `;
    const styleElement = document.createElement("style");
    styleElement.id = `carousel-style-${carouselId}`;
    styleElement.textContent = css;
    document.head.appendChild(styleElement);
  };

  // This is the function for building the carousel.
  const buildCarousel = (products) => {
    // If there are favourited items in the localStorage we get them if not we return empty array.
    const favorites = JSON.parse(localStorage.getItem("carousel_favorites")) || [];

    // We loop over the products using map.
    // If the "price" is lover than "original_price" we change the priceHTML in order to show discounted version
    const productCardsHTML = products.map((product) => {
      const isDiscounted = product.price < product.original_price;
      let priceHTML = `<span class="product-item__new-price">${product.price.toFixed(2).replace(".", ",")} TL</span>`;

      if (isDiscounted) {
        const discountPercentage = Math.round(((product.original_price - product.price) /product.original_price) * 100 );
          priceHTML = `
          <div class="d-flex align-items-center">
            <span class="product-item__old-price">${product.original_price.toFixed(2).replace(".", ",")} TL</span>
            <span class="product-item__percent ml-2">%${discountPercentage} <i class="icon icon-decrease"></i></span>
          </div>
          <span class="product-item__new-price discount-product">${product.price.toFixed(2).replace(".", ",")} TL</span>
        `;
      }

      //Here we check if the id is inside the localStorage of favorited items or not and build the html accordingly
      const isFavoritedClass = favorites.includes(product.id.toString()) ? "is-favorited": "";

      // Here I created the cards inside the carousel, 
      // in order to be pixel perfect I looked to browser's devtools and in there Section2A.eb-product-carousel.has-components> and created the product cards in the same structure.
        return `
        <div class="owl-item active">
          <div class="product-item">
            <a class="product-item-anchor" href="${product.url}" target="_blank">
              <figure class="product-item__img">
                <img class="lazyloaded" alt="${product.name}" src="${product.img}">
              </figure>
              <div class="product-item-content">
                <h2 class="product-item__brand"><b>${product.brand} -</b> <span>${product.name}</span></h2>
                <div class="product-item__price">${priceHTML}</div>
              </div>
            </a>
            <div class="heart ${isFavoritedClass}" data-product-id="${product.id}">
              <img id="default-favorite" src="assets/svg/default-favorite.svg" alt="heart" class="heart-icon">
            </div>
            <div class="product-item-content">
              <button class="btn close-btn add-to-cart-btn">Sepete Ekle</button>
            </div>
          </div>
        </div>
      `;
      })
      .join("");

    // Here I created the carousel's html structure again I took a look at <Section2A.eb-product-carousel>
    // Incase you wanted to use the script twice the events would mix up. So for this reason I assigned a temporary id to carousels these ids will be passed to events and css.
    // In this carousel I used the just above created "productCardsHTML"
    const carouselId = `custom-carousel-${Date.now()}`;
    const carouselHTML = `
      <div id="${carouselId}" class="eb-product-carousel custom-carousel">
        <div class="banner">
          <div class="container">
            <div class="banner__titles"><h2 class="title-primary">Beğenebileceğinizi düşündüklerimiz</h2></div>
            <div class="banner__wrapper">
              <div class="owl-carousel owl-theme owl-loaded owl-responsive owl-drag">
                <div class="owl-stage-outer ng-star-inserted">
                  <div class="owl-stage">
                    ${productCardsHTML}
                  </div>
                </div>
                <div class="owl-nav ng-star-inserted">
                  <div class="owl-prev"><i class="icon icon-prev"></i></div>
                  <div class="owl-next"><i class="icon icon-next"></i></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Here I Injected the buildCSS and setEvents again after the html gets rendered.
    const carouselPlace = "eb-root cx-storefront cx-page-layout cx-page-slot.Section2A.has-components";
    $(carouselPlace).prepend(carouselHTML);

    buildCSS(carouselId);
    setEvents(`#${carouselId}`);
  };

  // This is the setEvents button that is going to be used injected to the buildHTML.
  const setEvents = (carouselId) => {
    const track = $(`${carouselId} .owl-stage`);
    const cards = $(`${carouselId} .owl-item`);
    if (!track.length || !cards.length) return;

    const totalCards = cards.length;
    const cardWidth = cards.first().outerWidth(true);
    const visibleCards = 5;
    const state = { currentIndex: 0 };

    //Calling the events
    $(`${carouselId} .owl-next`).on("click",nextBtnEvent({track, state, cardWidth, totalCards, visibleCards}));
    $(`${carouselId} .owl-prev`).on("click",backBtnEvent({ track, state, cardWidth }));
    $(carouselId).on("click", ".heart", toggleFavBtnEvent());
  };

  // This event function is responsible for next button in the carousel it checks if it is the end of the list if not it uses css to slide
  function nextBtnEvent({track, state, cardWidth, totalCards, visibleCards}) {
    return function () {
      if (state.currentIndex < totalCards - visibleCards) {
        state.currentIndex++;
        track.css("transform", `translateX(-${state.currentIndex * cardWidth}px)`);
      }
    };
  }

  // Agaib this event function is responsible for back button in the carousel it checks if it is the begining of the list if not it uses css to slide
  function backBtnEvent({ track, state, cardWidth }) {
    return function () {
      if (state.currentIndex > 0) {
        state.currentIndex--;
        track.css("transform", `translateX(-${state.currentIndex * cardWidth}px)`);
      }
    };
  }

  // This is a event function in order to maintain the toggle for favourite it stores the id of the favourited item in the localStorage
  function toggleFavBtnEvent() {
    const favoritesKey = "carousel_favorites";
    return function (event) {
      const clickedToFavBtn = $(event.currentTarget).closest(".heart");
      const productId = String(clickedToFavBtn.data("product-id"));
      let favorites = JSON.parse(localStorage.getItem(favoritesKey)) || [];

      if (clickedToFavBtn.hasClass("is-favorited")) {
        favorites = favorites.filter((id) => id !== productId);
        clickedToFavBtn.removeClass("is-favorited");
      } 
      else {
        favorites.push(productId);
        clickedToFavBtn.addClass("is-favorited");
      }
      localStorage.setItem(favoritesKey, JSON.stringify(favorites));
    };
  }

  // I used jQuerry, since it was optional and possible to be used. But ebebek website had not used jQurry according to errors I got. 
  // So I made sure the code is working by downloading the jQuerry before the script runs. After wards this functions runs the script.
  // But in order to keep the integrity of the structure provided in the pdf I kept it downbelow in the source code.
  const loadJQuery = () => {
    if (window.jQuery) {
      init();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js";
    script.onload = init;
    script.onerror = () => console.error("Could not load jQuery.");
    document.head.appendChild(script);
  };

  // Start the entire process
  loadJQuery();
})();
