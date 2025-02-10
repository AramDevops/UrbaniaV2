// ---------------------------------------------------------------------
// Professeur/Auteur : Akram Nasr
// Courriel : Akram.Nasr@cmontmorency.qc.ca
// Cours : 420 4E6 MO - Analyse et conception de modèles
// ---------------------------------------------------------------------


$(document).ready(function() {
    // Initially, we define items with the same structure (it can be empty or a fallback)
    var items = {
        breuvages: [],
        plats: []
    };

    var currentCategory = "breuvages";
    var cart = JSON.parse(localStorage.getItem("cart")) || [];
    var orderHistory = JSON.parse(localStorage.getItem("orderHistory")) || [];

    // --- Coupon Global Variable ---
    var appliedCoupon = null; // Will hold discount rate (e.g., 0.3 for 30% off)

    // --- Update Cart Function (now includes coupon discount) ---
    function updateCart() {
        var cartList = $("#cart-items");
        cartList.html("");
        var total = 0;
        cart.forEach((item, index) => {
            cartList.append(`<li>${item.name} - ${item.price}$ <button class="remove-item" data-index="${index}">❌</button></li>`);
            total += item.price;
        });

        // If a coupon is applied, calculate the discounted total
        if (appliedCoupon !== null) {
            var finalTotal = total * (1 - appliedCoupon);
            $("#cart-total").html(`${finalTotal.toFixed(2)}`);
        } else {
            $("#cart-total").text(total.toFixed(2));
        }

        $("#cart-count").text(cart.length);
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    function updateOrderHistory() {
        var historyList = $("#order-history");
        historyList.html("");
        orderHistory.forEach(order => {
            historyList.append(`<li>${order.date} - ${order.items.length} articles - ${order.total}$</li>`);
        });
        localStorage.setItem("orderHistory", JSON.stringify(orderHistory));
    }

    // --- Function to load the carousel ---
    function loadCarousel(category) {
        var carousel = $("#carousel");
        carousel.trigger("destroy.owl.carousel");
        carousel.html("");

        items[category].forEach(item => {
            carousel.append(`
          <div class="item" data-name="${item.name}" data-price="${item.price}">
              <img src="${item.img}" alt="${item.name}">
              <h3>${item.name}</h3>
              <p>${item.price}$</p>
              <h1 class="item-description">${item.desc}</h1>
              <button class="btn add-to-cart">Ajouter au panier</button>
          </div>
      `);
        });

        carousel.owlCarousel({
            items: 3,
            loop: true,
            autoplay: true,
            margin: 10,
            nav: true
        });
    }

    // --- Coupon Button Handlers ---
    $(".coupon-btn").click(function() {
        var discount = parseFloat($(this).data("discount"));
        appliedCoupon = discount;
        $("#coupon-value").text((discount * 100) + "%");
        $("#applied-coupon").show();
        updateCart();
    });

    $("#remove-coupon").click(function() {
        appliedCoupon = null;
        $("#applied-coupon").hide();
        updateCart();
    });

    // --- Other Event Handlers ---
    $("#toggle-category").click(function() {
        currentCategory = currentCategory === "breuvages" ? "plats" : "breuvages";
        loadCarousel(currentCategory);
        $("#carousel-title").text(currentCategory === "breuvages" ? "Menu Breuvages" : "Menu Plats");
        $(this).text(currentCategory === "breuvages" ? "Menu Plats" : "Menu Breuvages");
    });

    $("#search-input").on("input", function() {
        var searchValue = $(this).val().toLowerCase();
        $(".owl-carousel .item").each(function() {
            var itemName = $(this).data("name").toLowerCase();
            $(this).toggle(itemName.includes(searchValue));
        });
    });

    $(document).on("click", ".add-to-cart", function() {
        var parent = $(this).parent();
        var name = parent.data("name");
        var price = parseFloat(parent.data("price"));
        cart.push({ name, price });
        updateCart();
    });

    $(document).on("click", ".remove-item", function(event) {
        event.stopPropagation();
        var index = $(this).data("index");
        cart.splice(index, 1);
        updateCart();
    });

    $("#clear-cart").click(function() {
        cart = [];
        updateCart();
    });

    // --- Payment Modal Handlers ---
    $("#checkout").click(function() {
        if (cart.length > 0) {
            $("#payment-modal").fadeIn();
            $(".modal-backdrop").fadeIn();
            $("body").addClass("modal-open");
        } else {
            alert("Votre panier est vide.");
        }
    });

    // Handle payment form submission and send order to API
    $("#payment-form").submit(function(event) {
        event.preventDefault();

        // Retrieve payment details
        var cardHolder = $("#card-holder").val().trim();
        var cardNumber = $("#card-number").val().trim();
        var cardExpiration = $("#card-expiration").val().trim();
        var cardCvv = $("#card-cvv").val().trim();

        if (!cardHolder || !cardNumber || !cardExpiration || !cardCvv) {
            alert("Veuillez remplir tous les champs de paiement.");
            return;
        }

        // Compute total price from the cart (display already reflects any discount)
        var totalDisplay = $("#cart-total").text();
        var totalPrice = parseFloat(totalDisplay);

        // Create a comma-separated list of ordered item names
        var itemsOrdered = cart.map(function(item) {
            return item.name;
        }).join(", ");

        // Build the order object according to the new table requirements.
        var orderData = {
            user: cardHolder,
            card_number: cardNumber,
            items: itemsOrdered,
            total_price: totalPrice,
            status: "En cours" // Default order status
        };

        console.log("Sending order:", orderData);

        // Send the order data to the API endpoint using Fetch.
        fetch('/api/addOrder', { // Ensure your Flask endpoint is updated to accept this data.
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            })
            .then(function(response) {
                return response.json();
            })
            .then(function(result) {
                if (result.message) {
                    alert("Paiement accepté et commande enregistrée avec succès !");
                    // Save the order locally by adding it to orderHistory
                    var newOrder = {
                        date: new Date().toLocaleString(),
                        items: cart,
                        total: totalPrice
                    };
                    orderHistory.push(newOrder);
                    localStorage.setItem("orderHistory", JSON.stringify(orderHistory));
                    updateOrderHistory();

                    // Clear the cart and update the UI
                    cart = [];
                    updateCart();

                    // Close modals and remove backdrop
                    $("#payment-modal").fadeOut();
                    $("#cart-modal").fadeOut();
                    $(".modal-backdrop").fadeOut();
                    $("body").removeClass("modal-open");

                    // Reset the payment form
                    $("#payment-form")[0].reset();
                } else {
                    alert("Erreur lors de l'enregistrement de la commande : " + (result.error || "Veuillez réessayer."));
                }
            })
            .catch(function(err) {
                console.error(err);
                alert("Une erreur s'est produite lors de l'enregistrement de la commande. Veuillez réessayer.");
            });
    });

    // Close payment modal on close icon click
    $(".close-payment-modal").click(function() {
        $("#payment-modal").fadeOut();
        $(".modal-backdrop").fadeOut();
        $("body").removeClass("modal-open");
    });

    // --- Existing Modal Handlers for Cart Modal ---
    $("#cart-icon").click(function() {
        $("#cart-modal").fadeIn();
        $(".modal-backdrop").fadeIn();
        $("body").addClass("modal-open");
    });

    $(".close-modal").click(function() {
        $("#cart-modal").fadeOut();
        $(".modal-backdrop").fadeOut();
        $("body").removeClass("modal-open");
    });

    $(document).on("mouseenter", ".item", function() {
        $(this).find("img").css("filter", "blur(5px)");
        $(this).find(".item-description").css({
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "position": "absolute",
            "top": "50%",
            "left": "46%",
            "transform": "translate(-50%, -50%)",
            "background": "rgba(0, 0, 0, 0.85)",
            "color": "white",
            "padding": "10px",
            "border-radius": "5px",
            "width": "80%",
            "text-align": "center"
        });
    });

    $(document).on("mouseleave", ".item", function() {
        $(this).find("img").css("filter", "none");
        $(this).find(".item-description").css("display", "none");
    });

    // Initial load: Replace hardcoded items by fetching from the API.
    $.ajax({
        url: '/api/admin/menu',
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            // Rebuild the items object from the API response.
            // The API returns an object with keys like "breuvages" and "plats" based on the category.
            items = { breuvages: [], plats: [] };
            data.forEach(function(item) {
                // Build the image path from the filename
                var imagePath = "static/images/" + item.picture;
                if (item.category === "breuvages") {
                    items.breuvages.push({
                        name: item.name,
                        img: imagePath,
                        price: item.price,
                        desc: item.description
                    });
                } else if (item.category === "plats") {
                    items.plats.push({
                        name: item.name,
                        img: imagePath,
                        price: item.price,
                        desc: item.description
                    });
                }
            });
            // After updating items, load the carousel for the current category.
            loadCarousel(currentCategory);
        },
        error: function(xhr) {
            console.error("Error fetching menu items from API:", xhr.responseText);
            // Optionally, fall back to a default behavior if needed.
            loadCarousel(currentCategory);
        }
    });

    // Helper: Email format validation
    function isValidEmail(email) {
        var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Individual field validations for "prenom"
    function validatePrenom() {
        let prenom = $('#prenom').val().trim();
        if (prenom === '') {
            $('#error-prenom').text("Merci de saisir votre prénom.");
            $('#prenom').css('border', '1px solid red');
            return false;
        } else if (prenom.length < 3) {
            $('#error-prenom').text("Veuillez entrer au moins 3 caractères.");
            $('#prenom').css('border', '1px solid red');
            return false;
        } else if (prenom.charAt(0) !== prenom.charAt(0).toUpperCase()) {
            $('#error-prenom').text("La première lettre doit être en majuscule.");
            $('#prenom').css('border', '1px solid red');
            return false;
        } else {
            $('#error-prenom').text("");
            $('#prenom').css('border', '1px solid green');
            return true;
        }
    }

    function validateNom() {
        let nom = $('#nom').val().trim();
        if (nom === '') {
            $('#error-nom').text("Merci de saisir votre nom de famille.");
            $('#nom').css('border', '1px solid red');
            return false;
        } else if (nom.length > 50) {
            $('#error-nom').text("Veuillez entrer au maximum 50 caractères.");
            $('#nom').css('border', '1px solid red');
            return false;
        } else if (nom !== nom.toUpperCase()) {
            $('#error-nom').text("Toutes les lettres doivent être en majuscules.");
            $('#nom').css('border', '1px solid red');
            return false;
        } else {
            $('#error-nom').text("");
            $('#nom').css('border', '1px solid green');
            return true;
        }
    }

    function validateCategorie() {
        let categorie = $('#categorie').val();
        if (categorie === '') {
            $('#error-categorie').text("Merci de sélectionner une catégorie de demande.");
            $('#categorie').css('border', '1px solid red');
            return false;
        } else {
            $('#error-categorie').text("");
            $('#categorie').css('border', '1px solid green');
            return true;
        }
    }

    function validateCourriel() {
        if ($('input[name="notification"]:checked').val() === "courriel") {
            let courriel = $('#courriel').val().trim();
            if (courriel === '') {
                $('#error-courriel').text("Merci de saisir votre courriel.");
                $('#courriel').css('border', '1px solid red');
                return false;
            } else if (!isValidEmail(courriel)) {
                $('#error-courriel').text("Veuillez saisir une adresse courriel valide.");
                $('#courriel').css('border', '1px solid red');
                return false;
            } else {
                $('#error-courriel').text("");
                $('#courriel').css('border', '1px solid green');
                return true;
            }
        }
        return true;
    }

    function validateConfirmationCourriel() {
        if ($('input[name="notification"]:checked').val() === "courriel") {
            let courriel = $('#courriel').val().trim();
            let confirmation = $('#confirmation_courriel').val().trim();
            if (confirmation === '') {
                $('#error-confirmation-courriel').text("Merci de saisir la confirmation de votre courriel.");
                $('#confirmation_courriel').css('border', '1px solid red');
                return false;
            } else if (courriel !== confirmation) {
                $('#error-confirmation-courriel').text("Les courriels ne correspondent pas.");
                $('#confirmation_courriel').css('border', '1px solid red');
                return false;
            } else {
                $('#error-confirmation-courriel').text("");
                $('#confirmation_courriel').css('border', '1px solid green');
                return true;
            }
        }
        return true;
    }

    function validateTelephone() {
        if ($('input[name="notification"]:checked').val() === "sms") {
            let telephone = $('#telephone').val().trim();
            if (telephone === '') {
                $('#error-telephone').text("Merci de saisir votre numéro de téléphone.");
                $('#telephone').css('border', '1px solid red');
                return false;
            } else {
                $('#error-telephone').text("");
                $('#telephone').css('border', '1px solid green');
                return true;
            }
        }
        return true;
    }

    function validateDescription() {
        let description = $('#description').val().trim();
        if (description === '') {
            $('#error-description').text("N'oubliez pas de décrire le problème rencontré.");
            $('#description').css('border', '1px solid red');
            return false;
        } else if (description.length < 5) {
            $('#error-description').text("La description du message doit comporter au moins 5 caractères.");
            $('#description').css('border', '1px solid red');
            return false;
        } else {
            $('#error-description').text("");
            $('#description').css('border', '1px solid green');
            return true;
        }
    }

    // Update the state of the submit button (id="send_btn")
    function updateSubmitButton() {
        let formValid = validatePrenom() &&
            validateNom() &&
            validateCategorie() &&
            validateCourriel() &&
            validateConfirmationCourriel() &&
            validateTelephone() &&
            validateDescription();
        $("#send_btn").prop("disabled", !formValid);
    }

    // When notification changes, reset/clear the related fields and errors
    $('input[name="notification"]').on('change', function() {
        let notif = $(this).val();
        if (notif === 'none') {
            $('#telephone').prop('disabled', true).val('').css('border', '');
            $('#courriel').prop('disabled', true).val('').css('border', '');
            $('#confirmation_courriel').prop('disabled', true).val('').css('border', '');
            $('#error-telephone, #error-courriel, #error-confirmation-courriel').text('');
        } else if (notif === 'courriel') {
            $('#courriel').prop('disabled', false);
            $('#confirmation_courriel').prop('disabled', false);
            $('#telephone').prop('disabled', true).val('').css('border', '');
            $('#error-telephone').text('');
        } else if (notif === 'sms') {
            $('#telephone').prop('disabled', false);
            $('#courriel').prop('disabled', true).val('').css('border', '');
            $('#confirmation_courriel').prop('disabled', true).val('').css('border', '');
            $('#error-courriel, #error-confirmation-courriel').text('');
        }
        updateSubmitButton();
    });

    // Real-time validation for all fields using delegation
    $(document).on('input change', '#request input, #request textarea, #request select', function() {
        let field = $(this).attr('id');
        switch (field) {
            case 'prenom':
                validatePrenom();
                break;
            case 'nom':
                validateNom();
                break;
            case 'categorie':
                validateCategorie();
                break;
            case 'courriel':
                validateCourriel();
                break;
            case 'confirmation_courriel':
                validateConfirmationCourriel();
                break;
            case 'telephone':
                validateTelephone();
                break;
            case 'description':
                validateDescription();
                break;
        }
        updateSubmitButton();
    });

    // Final form submission: use Fetch API to send data to the backend
    $('#request').on('submit', function(e) {
        e.preventDefault();
        updateSubmitButton();
        if (!$("#send_btn").prop("disabled")) {
            // Gather form values
            const prenom = $('#prenom').val().trim();
            const nom = $('#nom').val().trim();
            const category = $('#categorie').val();
            const notification_method = $('input[name="notification"]:checked').val();
            const telephone = $('#telephone').val().trim();
            const email = $('#courriel').val().trim();
            const description = $('#description').val().trim();

            // Build the JSON object with all required fields
            const data = {
                prenom: prenom,
                nom: nom,
                category: category,
                notification_method: notification_method,
                telephone: (notification_method === "sms") ? telephone : null,
                email: (notification_method === "courriel") ? email : null,
                description: description
            };

            // Send data to the backend using Fetch API
            fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                })
                .then(response => response.json())
                .then(result => {
                    if (result.message) {
                        alert("Votre demande a été envoyée avec succès.");
                        $('#request')[0].reset();
                        $('#request input, #request textarea, #request select').css('border', '');
                        $('#request .error-message').text('');
                        $('#telephone, #courriel, #confirmation_courriel').prop('disabled', true);
                        updateSubmitButton();
                    } else {
                        alert("Erreur: " + (result.error || "Veuillez réessayer."));
                    }
                })
                .catch(err => {
                    console.error(err);
                    alert("Une erreur s'est produite lors de l'envoi de votre demande. Veuillez réessayer.");
                });
        }
    });

    updateCart();
    updateOrderHistory();
    updateSubmitButton();
});