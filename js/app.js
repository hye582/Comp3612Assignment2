document.addEventListener("DOMContentLoaded", function () {
    const url = "./data/data-minifed.json";

    let products = [];

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

        displayProduct(products[0]);
        })
        .catch(function (error) {
            console.error("Unable to load products:", error);
        });

        // Display one product in the existing HTML
function displayProduct(product) {
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

    // Update the breadcrumb
    document.querySelector("#breadcrumb-category").textContent =
        product.category;

    document.querySelector("#breadcrumb-title").textContent =
        product.title;

    // Show the first image from the product's images array
    const image = document.querySelector("#product-image");

    image.src = product.images[0];
    image.alt = product.title;
    image.hidden = false;

    // Reset the quantity when displaying a product
    document.querySelector("#product-quantity").value = 1;
}
});