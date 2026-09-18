console.log("[Client] Starting...");


// --------------------------------------------------
// Elements
// --------------------------------------------------

const testButton =
    document.getElementById("testButton");

const status =
    document.getElementById("status");

const apiResponse =
    document.getElementById("apiResponse");


// --------------------------------------------------
// Get API data
// --------------------------------------------------

async function getNetworkInfo() {

    try {

        status.textContent = "Connecting to API...";
        status.className = "status loading";


        const response =
            await fetch("/api/network");


        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );

        }


        const data =
            await response.json();


        console.log(
            "[Client] API response:",
            data
        );


        // ------------------------------------------
        // Network
        // ------------------------------------------

        document.getElementById("host")
            .textContent =
            data.request.host;

        document.getElementById("protocol")
            .textContent =
            data.request.protocol;

        document.getElementById("port")
            .textContent =
            data.request.serverPort;

        document.getElementById("clientIp")
            .textContent =
            data.request.clientIp;

        document.getElementById("serverIp")
            .textContent =
            data.request.serverIp;


        // ------------------------------------------
        // Server
        // ------------------------------------------

        document.getElementById("hostname")
            .textContent =
            data.server.hostname;

        document.getElementById("serverContainerIp")
            .textContent =
            data.server.ip;

        document.getElementById("platform")
            .textContent =
            data.server.platform;

        document.getElementById("architecture")
            .textContent =
            data.server.architecture;

        document.getElementById("nodeVersion")
            .textContent =
            data.server.nodeVersion;


        // ------------------------------------------
        // Full API response
        // ------------------------------------------

        apiResponse.textContent =
            JSON.stringify(data, null, 4);


        // ------------------------------------------
        // Status
        // ------------------------------------------

        status.textContent =
            "✓ API Connected";

        status.className =
            "status success";


    } catch (error) {

        console.error(
            "[Client] API error:",
            error
        );

        status.textContent =
            "✗ API Connection Failed";

        status.className =
            "status error";

        apiResponse.textContent =
            error.message;
    }
}


// --------------------------------------------------
// Browser information
// --------------------------------------------------

function loadBrowserInfo() {

    document.getElementById("browserHost")
        .textContent =
        window.location.host;

    document.getElementById("screen")
        .textContent =
        `${screen.width} × ${screen.height}`;

    document.getElementById("language")
        .textContent =
        navigator.language;
}


// --------------------------------------------------
// Button
// --------------------------------------------------

testButton.addEventListener(
    "click",
    getNetworkInfo
);


// --------------------------------------------------
// Start
// --------------------------------------------------

loadBrowserInfo();

getNetworkInfo();

console.log("[Client] Ready");