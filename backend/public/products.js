window.addEventListener("scroll", function () {
  var navbar = document.getElementById("navbar");
  var scrollThreshold = 40; // Adjust this value to set the scroll threshold

  if (window.scrollY > scrollThreshold) {
    navbar.classList.add("shadow");
  } else {
    navbar.classList.remove("shadow");
  }
});

let products = [
  {
    productName: "Fruit of the Loom Men's Eversoft Cotton T Shirts",
    price: 1054,
    availableColors: ["red", "orange", "green", "navy", "lightblue"],
    imageUrl:
      "https://store-bixbang.myshopify.com/cdn/shop/products/p-1_1024x.jpg?v=1561600837",
  },
  {
    productName: "MAGCOMSEN Men's T-shirt",
    price: 1583,
    availableColors: ["blue", "orange", "grey", "red", "lightblue"],
    imageUrl:
      "https://store-bixbang.myshopify.com/cdn/shop/products/xdt1_1024x.jpg?v=1561603551",
  },
  {
    productName: "Men's Sun Shirts",
    price: 1249,
    availableColors: [
      "lightblue",
      "orange",
      "yellow",
      "red",
      "green",
      "purple",
    ],
    imageUrl:
      "https://store-bixbang.myshopify.com/cdn/shop/products/xlc1_1024x.jpg?v=1561602908",
  },
  {
    productName: "Men's Classic-Fit Pant",
    price: 2333,
    availableColors: ["Olive", "brown", "black"],
    imageUrl:
      "https://store-bixbang.myshopify.com/cdn/shop/products/1-1_1024x.jpg?v=1561602127",
  },
  {
    productName: "WHITIN Men's Zero Drop Running Shoes",
    price: "3589",
    availableColors: ["red", "green", "black", "grey"],
    imageUrl:
      "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/bf9277843b0a408eab2a9eec12a9da43_9366/STRIX_1.0_SHOES_Black_GA3879_02_standard_hover.jpg",
  },
  {
    productName: "Dress With Tie Sleeves",
    price: 3900,
    availableColors: ["orange", "pink", "lightblue"],
    imageUrl:
      "https://store-bixbang.myshopify.com/cdn/shop/products/a1_1024x.jpg?v=1561602483",
  },
  {
    productName: "Buttoned Shirt",
    price: 858,
    availableColors: ["yellow", "navy", "dodgerblue"],
    imageUrl:
      "https://store-bixbang.myshopify.com/cdn/shop/products/p-21_600x.jpg?v=1561601244",
  },
  {
    productName: "Flowy Yeallow",
    price: 2800,
    availableColors: ["black", "grey", "navy"],
    imageUrl:
      "https://store-bixbang.myshopify.com/cdn/shop/products/qd1_1024x.jpg?v=1561602799",
  },
];

let colorsList = [
  "red",
  "pink",
  "navy",
  "lightgreen",
  "lightblue",
  "blue",
  "orange",
  "green",
  "grey",
];

let selectedColors = [];
let sizeList = ["S", "M", "L"];
if (colorsList.length > 0) {
  let colorListDiv = document.querySelector("#color-list");
  let colorSelected = colorsList[0];

  for (let i = 0; i < colorsList.length; i++) {
    let colorDiv = document.createElement("div");
    colorDiv.classList.add("colorDiv");
    colorDiv.style.backgroundColor = colorsList[i];
    colorDiv.id = colorsList[i];

    colorListDiv.append(colorDiv);
  }
  let colors = document.querySelectorAll(".colorDiv");

  colors.forEach((item) => {
    item.addEventListener("click", (e) => {
      if (!selectedColors.includes(item.id)) {
        item.classList.add("selectedColor");
        selectedColors.push(item.id);
      } else {
        item.classList.remove("selectedColor");
        const index = selectedColors.indexOf(item.id);
        selectedColors.splice(index, 1);
      }

      if (selectedColors.length == 0) {
        console.log("all color filter deleted");
        let productsSection = document.querySelector("#products");

        productsSection.innerHTML = "";
        products.forEach((item) => {
          let productElement = document.createElement("div");
          productElement.classList.add("product");
          productElement.innerHTML = `
    <img
        src="${item.imageUrl}"
        alt=""
    />
    <p class="product-name">${item.productName}</p>
    <p class="product-price">₹ &nbsp;${item.price}&nbsp;</p>
    `;
          productsSection.append(productElement);
        });
      } else {
        let displayedColors = [];

        selectedColors.forEach((item) => {
          products.forEach((product) => {
            if (product.availableColors.includes(item)) {
              if (!displayedColors.includes(product)) {
                displayedColors.push(product);
              }
            }
          });
        });
        let productsSection = document.querySelector("#products");
        productsSection.innerHTML = "";
        displayedColors.forEach((item) => {
          console.log(item);
          let productElement = document.createElement("div");
          productElement.classList.add("product");
          productElement.innerHTML = `
    <img
        src="${item.imageUrl}"
        alt=""
    />
    <p class="product-name">${item.productName}</p>
    <p class="product-price">₹ &nbsp;${item.price}&nbsp;</p>
    `;
          productsSection.append(productElement);
        });
      }
    });
  });
} else if (colorsList.length == 0) {
  document.querySelector("#available-colors").style.display = "none";
}

let productsSection = document.querySelector("#products");
products.forEach((item) => {
  console.log(item);
  let productElement = document.createElement("div");
  productElement.classList.add("product");
  productElement.innerHTML = `
    <img
        src="${item.imageUrl}"
        alt=""
    />
    <p class="product-name">${item.productName}</p>
    <p class="product-price">₹ &nbsp;${item.price}&nbsp;</p>
    `;
  productsSection.append(productElement);
});

let rangeMin = 100;
const range = document.querySelector(".range-selected");
const rangeInput = document.querySelectorAll(".range-input input");
const rangePrice = document.querySelectorAll(".range-price input");
rangeInput.forEach((input) => {
  input.addEventListener("input", (e) => {
    let productsSection = document.querySelector("#products");
    let priceRange = [];

    productsSection.innerHTML = "";
    let minRange = parseInt(rangeInput[0].value);
    let maxRange = parseInt(rangeInput[1].value);
    if (maxRange - minRange < rangeMin) {
      if (e.target.className === "min") {
        rangeInput[0].value = maxRange - rangeMin;
      } else {
        rangeInput[1].value = minRange + rangeMin;
      }
    } else {
      rangePrice[0].value = minRange;
      rangePrice[1].value = maxRange;
      range.style.left = (minRange / rangeInput[0].max) * 100 + "%";
      range.style.right = 100 - (maxRange / rangeInput[1].max) * 100 + "%";
    }

    products.forEach((item) => {
      if (item.price >= minRange && item.price <= maxRange) {
        priceRange.push(item);
      }
    });
    priceRange.forEach((item) => {
      let productElement = document.createElement("div");
      productElement.classList.add("product");
      productElement.innerHTML = `
    <img
        src="${item.imageUrl}"
        alt=""
    />
    <p class="product-name">${item.productName}</p>
    <p class="product-price">₹ &nbsp;${item.price}&nbsp;</p>
    `;
      productsSection.append(productElement);
    });
  });
});

rangePrice.forEach((input) => {
  input.addEventListener("input", (e) => {
    let minPrice = rangePrice[0].value;
    let maxPrice = rangePrice[1].value;
    if (maxPrice - minPrice >= rangeMin || maxPrice <= rangeInput[1].max) {
      if (e.target.className === "min") {
        console.log(minPrice, maxPrice);

        rangeInput[0].value = minPrice;
        range.style.left = (minPrice / rangeInput[0].max) * 100 + "%";
      } else {
        rangeInput[1].value = maxPrice;
        range.style.right = 100 - (maxPrice / rangeInput[1].max) * 100 + "%";
      }
    }
  });
});

let filter = false;

document.querySelector("button.filters").addEventListener("click", () => {
  if (!filter) {
    document.querySelector("#filters").classList.add("visibleFilter");
    filter = true;
    // To enable the overlay

    document.querySelector(".overlay").style.display = "block";
  } else {
    document.querySelector("#filters").classList.remove("visibleFilter");
    filter = false;
    document.querySelector(".overlay").style.display = "none";
  }
});
