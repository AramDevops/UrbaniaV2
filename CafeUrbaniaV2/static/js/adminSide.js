// ---------------------------------------------------------------------
// Professeur/Auteur : Akram Nasr
// Courriel : Akram.Nasr@cmontmorency.qc.ca
// Cours : 420 4E6 MO - Analyse et conception de modèles
// ---------------------------------------------------------------------
  

  // Fetch Orders (Admin)
  function fetchAdminOrders() {
      $.ajax({
          url: '/api/admin/orders',
          type: 'GET',
          dataType: 'json',
          success: function(data) {
              let ordersHtml = "";
              data.forEach(function(order) {
                  ordersHtml += `<tr>
                <td>#${order.id}</td>
                <td>${order.user}</td>
                <td>${order.items}</td>
                <td>$${parseFloat(order.total_price).toFixed(2)}</td>
                <td>${order.date}</td>
                <td id="status-${order.id}">${order.status}</td>
                <td>`;
                  if (order.status === "En cours") {
                      ordersHtml += `<button class="btn btn-sm btn-success update-status" data-order-id="${order.id}" data-new-status="Complété">Marquer comme Complété</button>`;
                  } else {
                      ordersHtml += `<button class="btn btn-sm btn-warning update-status" data-order-id="${order.id}" data-new-status="En cours">Marquer comme En cours</button>`;
                  }
                  ordersHtml += `</td></tr>`;
              });
              $("#ordersTableBody").html(ordersHtml);
          }
      });
  }

  // Update order status via admin API
  $(document).on("click", ".update-status", function() {
      let orderId = $(this).data("order-id");
      let newStatus = $(this).data("new-status");
      $.ajax({
          url: '/api/admin/orders/' + orderId,
          type: 'PUT',
          contentType: 'application/json',
          data: JSON.stringify({
              status: newStatus
          }),
          success: function(response) {
              fetchAdminOrders();
          }
      });
  });

  // Fetch Contacts (Admin)
  function fetchAdminContacts() {
      $.ajax({
          url: '/api/admin/contacts',
          type: 'GET',
          dataType: 'json',
          success: function(data) {
              let contactsHtml = "";
              data.forEach(function(contact) {
                  contactsHtml += `<tr>
                <td>#${contact.id}</td>
                <td>${contact.prenom}</td>
                <td>${contact.nom}</td>
                <td>${contact.category}</td>
                <td>${contact.notification_method}</td>
                <td>${contact.telephone || ""}</td>
                <td>${contact.email || ""}</td>
                <td>${contact.description}</td>
                <td>${contact.date}</td>
              </tr>`;
              });
              $("#contactsTableBody").html(contactsHtml);
          }
      });
  }

  // Fetch Menu Items (Admin)
  function fetchAdminMenuItems() {
      $.ajax({
          url: '/api/admin/menu',
          type: 'GET',
          dataType: 'json',
          success: function(data) {
              let menuHtml = "";
              data.forEach(function(item) {
                  menuHtml += `<tr>
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.category}</td>
                <td>$${parseFloat(item.price).toFixed(2)}</td>
                <td>${item.description || ''}</td>
                <td><img src="static/images/${item.picture}" alt="${item.name}" style="width:150px;height:auto;"></td>
                <td class="crud-tools-menu">
                  <button class="btn btn-sm btn-warning open-edit-modal" data-item-id="${item.id}">🖋️</button>
                  <button class="btn btn-sm btn-danger delete-menu" data-item-id="${item.id}">❌</button>
                </td>
              </tr>`;
              });
              $("#menuTableBody").html(menuHtml);
          }
      });
  }

  // Ajout d'un nouvel article via l'API admin
  $("#menuForm").on("submit", function(e) {
      e.preventDefault();
      let formData = new FormData(this);

      for (let [key, value] of formData.entries()) {
          console.log(key, value);
      }

      $.ajax({
          url: '/api/admin/menu',
          type: 'POST',
          data: formData,
          processData: false,
          contentType: false,
          success: function(response) {
              fetchAdminMenuItems();
              $("#menuForm").trigger("reset");
          }
      });
  });


  // Ouvrir le modal d'édition avec les données actuelles de l'article
  $(document).on("click", ".open-edit-modal", function() {
      let itemId = $(this).data("item-id");
      // Récupérer les données actuelles de l'article à partir de la ligne
      let row = $(this).closest("tr");
      let currentName = row.find("td:eq(1)").text();
      let currentCategory = row.find("td:eq(2)").text();
      let currentPrice = row.find("td:eq(3)").text().replace('$', '');
      let currentDescription = row.find("td:eq(4)").text();

      // Remplir le formulaire du modal d'édition
      $("#editItemId").val(itemId);
      $("#editItemName").val(currentName);
      $("#editItemCategory").val(currentCategory);
      $("#editItemPrice").val(currentPrice);
      $("#editItemDescription").val(currentDescription);
      $("#editMenuModal").fadeIn();
  });

  // Fermer le modal d'édition
  $(".close-modal").click(function() {
      $("#editMenuModal").fadeOut();
  });

  // Soumettre le formulaire d'édition
  $("#editMenuForm").on("submit", function(e) {
      e.preventDefault();
      let itemId = $("#editItemId").val();
      let formData = new FormData(this);
      $.ajax({
          url: '/api/admin/menu/' + itemId,
          type: 'PUT',
          data: formData,
          processData: false,
          contentType: false,
          success: function(response) {
              fetchAdminMenuItems();
              $("#editMenuModal").fadeOut();
          }
      });
  });

  // Supprimer un article du menu via l'API admin
  $(document).on("click", ".delete-menu", function() {
      let itemId = $(this).data("item-id");
      if (confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
          $.ajax({
              url: '/api/admin/menu/' + itemId,
              type: 'DELETE',
              success: function(response) {
                  fetchAdminMenuItems();
              }
          });
      }
  });

  // ---------------------------
  // Chargement initial des données
  // ---------------------------
  $(document).ready(function() {
      fetchAdminOrders();
      fetchAdminContacts();
      fetchAdminMenuItems();

      // Disable submit button by default
      $("#menuForm button[type='submit']").prop("disabled", true);

      // Function to check if all required fields are filled
      function checkFormCompletion() {
          let isValid = true;

          $("#menuForm input[required], #menuForm select[required]").each(function() {
              if ($(this).val().trim() === "") {
                  isValid = false;
              }
          });

          // Enable or disable the submit button
          $("#menuForm button[type='submit']").prop("disabled", !isValid);
      }

      // Attach event listener to input fields to check when they change
      $("#menuForm input, #menuForm select").on("input change", function() {
          checkFormCompletion();
      });
  });