// Database configuration
const DB_NAME = "DELIVERY-DB";
const REL_NAME = "SHIPMENT-TABLE";
const BASE_URL = "http://api.login2explore.com:5575";
const API_ENDPOINT = "/api/irl";
const TOKEN = "YOUR_CONNECTION_TOKEN"; // Replace with your actual token

// Initialize form on page load
$(document).ready(function() {
    resetForm();
    $("#shipmentNo").focus();
    
    // Event listeners
    $("#shipmentNo").on("blur", checkShipmentNo);
    $("#saveBtn").click(saveShipment);
    $("#updateBtn").click(updateShipment);
    $("#resetBtn").click(resetForm);
});

// Reset form to initial state
function resetForm() {
    $("#shipmentForm")[0].reset();
    $("#shipmentNo").prop("disabled", false).focus();
    $("#description, #source, #destination, #shippingDate, #expectedDeliveryDate").prop("disabled", true);
    $("#saveBtn, #updateBtn").prop("disabled", true);
    $("#resetBtn").prop("disabled", false);
    $(".error").text("");
}

// Check if shipment number exists in database
function checkShipmentNo() {
    const shipmentNo = $("#shipmentNo").val().trim();
    
    if (!shipmentNo) {
        $("#shipmentNoError").text("Shipment number is required");
        return;
    }
    
    $("#shipmentNoError").text("");
    
    try {
        // Prepare request to check if shipment exists
        const request = {
            token: TOKEN,
            dbName: DB_NAME,
            rel: REL_NAME,
            cmd: "GET",
            jsonStr: { "Shipment-No.": shipmentNo }
        };
        
        // Make synchronous request
        jQuery.ajaxSetup({ async: false });
        const response = executeCommandAtGivenBaseUrl(BASE_URL, API_ENDPOINT, JSON.stringify(request));
        jQuery.ajaxSetup({ async: true });
        
        if (response && response.status === 200) {
            const data = JSON.parse(response.data);
            
            if (data.data) {
                // Shipment exists - populate form for update
                const shipment = JSON.parse