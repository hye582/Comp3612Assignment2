document.addEventListener("DOMContentLoaded", function () {
    const url = "./data/data-minifed.json";

    let products = [];
    let currentProduct;
    let cart = [];

    const savedCart = localStorage.getItem("everydayShopCart");

    if (savedCart !== null) {
        cart = JSON.parse(savedCart);
    }

updateCartCount();

function updateCartCount() {
    let total = 0;

    for (const item of cart) {
        total += item.quantity;
    }

    document.querySelector("#cart-count").textContent = total;
}

document.querySelector("#add-to-cart").addEventListener("click", function () {
    if (!currentProduct) {
        return;
    }

    const quantity = Number(document.querySelector("#product-quantity").value);
    const message = document.querySelector("#toast");

    if (quantity < 1 || quantity !== Math.floor(quantity)) {
        message.textContent = "Please enter a positive whole number.";
        return;
    }

    // Look for this product in the cart
    let existingItem = cart.find(function (item) {
        return item.id === currentProduct.id;
    });

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ id: currentProduct.id, quantity: quantity });
    }

    localStorage.setItem("everydayShopCart", JSON.stringify(cart));
    updateCartCount();
    message.textContent = "Added to cart: " + currentProduct.title;
});

    // Return to the home view
const homeLinks = document.querySelectorAll('a[href="#home"]');

for (const link of homeLinks) {
    link.addEventListener("click", function () {
        document.querySelector("#single-product").hidden = true;
        document.querySelector("#home").hidden = false;
    });
}

    // Product image dialog
const imageDialog = document.querySelector("#product-image-dialog");
const largeImage = document.querySelector("#large-product-image");

// Open the image dialog
document.querySelector("#open-product-image")
    .addEventListener("click", function () {
        const productImage = document.querySelector("#product-image");

        // Do not open the dialog before a product image is available
        if (productImage.hidden || !productImage.getAttribute("src")) {
            return;
        }

        largeImage.src = productImage.src;
        largeImage.alt = productImage.alt;
        largeImage.hidden = false;

        document.querySelector("#image-dialog-title").textContent =
            productImage.alt;

        imageDialog.showModal();
    });

// Close the image dialog
document.querySelector("#close-product-image")
    .addEventListener("click", function () {
        imageDialog.close();
    });

    // Load the supplied product data
    fetch(url)
        .then(function (response) {
            if (!response.ok) {
                throw new Error("HTTP error: " + response.status);
            }

            return response.json();
        })
        .then(function (data) {
            products = data.products;

            if (!Array.isArray(products) || products.length === 0) {
                throw new Error("No product data is available.");
            }

            // Show featured products after the product data has loaded
            displayFeaturedProducts(products);
        })
        .catch(function (error) {
            console.error("Unable to load products:", error);

            document.querySelector("#toast").textContent =
                "Unable to load products. Please refresh and try again.";
        });

    // Display one product in the existing HTML
    function displayProduct(product) {
            currentProduct = product;

        // Basic product information
        document.querySelector("#product-title").textContent =
            product.title;

        document.querySelector("#product-price").textContent =
            "$" + product.price.toFixed(2);

        document.querySelector("#product-sku").textContent =
            product.sku;

        document.querySelector("#product-description").textContent =
            product.description;

        document.querySelector("#product-stock").textContent =
            product.availabilityStatus;

        // Breadcrumb
        document.querySelector("#breadcrumb-category").textContent =
            product.category;

        document.querySelector("#breadcrumb-title").textContent =
            product.title;

        // Main product image
        const image = document.querySelector("#product-image");

        image.src = product.images[0];
        image.alt = product.title;
        image.hidden = false;

        // Reset the quantity for the displayed product
        document.querySelector("#product-quantity").value = 1;

        // Product rating
        const rating = document.querySelector("#product-rating");

        rating.textContent =
            createStars(product.rating) +
            " (" + product.rating + " / 5)";

        rating.setAttribute(
            "aria-label",
            "Rating: " + product.rating + " out of 5"
        );

        // Product tags
        displayTags(product.tags);

        // Product specifications
        displaySpecifications(product);

        // Product reviews
        displayReviews(product.reviews);
    }

    // Display the first two products on the home page
function displayFeaturedProducts(products) {
    const container = document.querySelector("#featured-products");
    container.textContent = "";

    for (let i = 0; i < products.length && i < 2; i++) {
        const product = products[i];
        const button = document.createElement("button");

        button.type = "button";
        button.textContent = product.title;

        button.addEventListener("click", function () {
            displayProduct(product);

            document.querySelector("#home").hidden = true;
            document.querySelector("#single-product").hidden = false;
        });

        container.appendChild(button);
    }
}

    // Convert a rating into five filled or empty stars
    function createStars(rating) {
        const roundedRating = Math.round(rating);
        let stars = "";

        for (let i = 1; i <= 5; i++) {
            if (i <= roundedRating) {
                stars += "★";
            } else {
                stars += "☆";
            }
        }

        return stars;
    }

    // Display tags without keeping tags from a previous product
    function displayTags(tags) {
        const container = document.querySelector("#product-tags");
        container.textContent = "";

        tags.forEach(function (tag) {
            const span = document.createElement("span");
            span.textContent = tag;
            container.appendChild(span);
        });
    }

    // Display specifications using kg and cm
    function displaySpecifications(product) {
        document.querySelector("#product-weight").textContent =
            product.weight + " kg";

        document.querySelector("#product-dimensions").textContent =
            "Width: " + product.dimensions.width + " cm, " +
            "Height: " + product.dimensions.height + " cm, " +
            "Depth: " + product.dimensions.depth + " cm";

        document.querySelector("#product-warranty").textContent =
            product.warrantyInformation;

        document.querySelector("#product-shipping").textContent =
            product.shippingInformation;

        document.querySelector("#product-return-policy").textContent =
            product.returnPolicy;
    }

    // Display the selected product's reviews
    function displayReviews(reviews) {
        const container = document.querySelector("#product-reviews");

    // Remove reviews from the previously displayed product
        container.textContent = "";

        if (reviews.length === 0) {
         container.textContent = "No reviews yet.";
            return;
        }

        reviews.forEach(function (review) {
            const article = document.createElement("article");

        // Reviewer name
            const name = document.createElement("h3");
            name.textContent = review.reviewerName;

        // Review rating
            const rating = document.createElement("p");
            rating.textContent =
                createStars(review.rating) +
                " (" + review.rating + " / 5)";

            rating.setAttribute(
                "aria-label",
                "Rating: " + review.rating + " out of 5"
            );

        // Formatted review date
            const dateParagraph = document.createElement("p");
            const date = document.createElement("time");

            date.dateTime = review.date;

            date.textContent = new Date(review.date).toLocaleDateString(
                "en-CA",
            {
                year: "numeric",
                month: "long",
                day: "numeric",
                timeZone: "UTC"
            }
        );

        dateParagraph.appendChild(date);

        // Review comment
        const comment = document.createElement("p");
        comment.textContent = review.comment;

        article.appendChild(name);
        article.appendChild(rating);
        article.appendChild(dateParagraph);
        article.appendChild(comment);

        container.appendChild(article);
    });
}
});