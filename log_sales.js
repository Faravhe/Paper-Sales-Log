$(document).ready(function () {
    // Hardcoded salesperson name
    const salesperson = "Tauhidul Islam";

    // List of clients
    let clients = [
        "Shake Shack",
        "Toast",
        "Computer Science Department",
        "Teacher's College",
        "Starbucks",
        "Subsconsious",
        "Flat Top",
        "Joe's Coffee",
        "Max Caffe",
        "Nussbaum & Wu",
        "Taco Bell",
  ];

    // Initial sales data
    let sales = [
        {
            "salesperson": "James D. Halpert",
            "client": "Shake Shack",
            "reams": 100
        },
        {
            "salesperson": "Stanley Hudson",
            "client": "Toast",
            "reams": 400
        },
        {
            "salesperson": "Michael G. Scott",
            "client": "Computer Science Department",
            "reams": 1000
        },
    ]

    // Initialize autocomplete for the client input
    $("#client").autocomplete({
        source: clients, // Use the clients array as the source
        minLength: 0 // Show suggestions even when the input is empty
    });

    // Function to render the sales list
    function renderSales() {
        // Clear the current sales list
        $("#sales-list").empty();

        // Loop through the sales array and create a row for each sale
        for (let i = 0; i < sales.length; i++) {
            let sale = sales[i];

            // Create a new row with metadata (data-id) attached
            let row = $(`
                <div class="sale-row d-flex justify-content-between align-items-center p-2 border-bottom" data-id="${i}">
                    <span>${sale.client}</span>
                    <span>${sale.reams}</span>
                    <span>${sale.salesperson}</span>
                    <button class="delete-btn btn btn-danger btn-sm">Delete</button>
                </div>
            `);

            // Append the row to the sales list
            $("#sales-list").append(row);
        }

        // Make sales rows draggable
        $(".sale-row").draggable({
            revert: "invalid", // Revert if not dropped in the trash
            cursor: "move" // Change cursor to move when dragging
        });
    }

    // Function to add a new sale
    function addSale() {
        // Get values from the input fields
        const client = $("#client").val().trim();
        const reams = $("#reams").val().trim();

        // Validate inputs
        if (!client) {
            alert("Please enter a client name.");
            $("#client").focus(); // Move cursor to the client input
            return;
        }
        if (!reams || isNaN(reams)) {
            alert("Please enter a valid number of reams.");
            $("#reams").focus(); // Move cursor to the reams input
            return;
        }

        // If the client is not in the autocomplete list, add it
        if (!clients.includes(client)) {
            clients.push(client);
            $("#client").autocomplete("option", "source", clients); // Update autocomplete source
        }

        // Add the new sale to the beginning of the sales array
        sales.unshift({ client, reams: parseInt(reams), salesperson });

        // Re-render the sales list
        renderSales();

        // Clear input fields and focus on the client input
        $("#client").val("");
        $("#reams").val("");
        $("#client").focus();
    }

    // Submit button click event
    $("#submit").click(function () {
        addSale();
    });

    // Enter key press event in the reams input
    $("#reams").keypress(function (e) {
        if (e.which == 13) { // 13 is the keycode for Enter
            addSale();
        }
    });

    // Delete button click event
    $(document).on("click", ".delete-btn", function () {
        // Get the ID from the data attribute of the closest sale row
        const id = $(this).closest(".sale-row").data("id");

        // Remove the sale from the sales array using the ID
        sales.splice(id, 1);

        // Re-render the sales list
        renderSales();
    });

    // Make the trash div droppable
    $("#trash").droppable({
        accept: ".sale-row", // Only accept draggable sale rows
        hoverClass: "bg-warning", // Change background color when hovered
        drop: function (event, ui) {
            // Get the ID from the dropped row
            const id = ui.draggable.data("id");

            // Remove the sale from the sales array using the ID
            sales.splice(id, 1);

            // Re-render the sales list
            renderSales();
        }
    });

    // Initial render of the sales list
    renderSales();
});