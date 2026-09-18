const express = require("express");
const os = require("os");

const app = express();

const PORT = process.env.PORT || 5500;

// --------------------------------------------------
// Serve frontend
// --------------------------------------------------

app.use(express.static("client"));


// --------------------------------------------------
// API: Network information
// --------------------------------------------------

app.get("/api/network", (req, res) => {

    const interfaces = os.networkInterfaces();

    let containerIp = "unknown";

    for (const addresses of Object.values(interfaces)) {

        for (const address of addresses) {

            if (
                address.family === "IPv4" &&
                !address.internal
            ) {
                containerIp = address.address;
                break;
            }
        }

        if (containerIp !== "unknown") {
            break;
        }
    }

    res.json({

        success: true,

        message: "Hello from API server!",

        server: {
            hostname: os.hostname(),
            ip: containerIp,
            platform: os.platform(),
            architecture: os.arch(),
            nodeVersion: process.version
        },

        request: {
            clientIp:
                req.headers["x-forwarded-for"] ||
                req.socket.remoteAddress,

            serverIp:
                req.socket.localAddress,

            serverPort:
                req.socket.localPort,

            protocol:
                req.protocol,

            host:
                req.headers.host
        },

        time: new Date().toISOString()
    });
});


// --------------------------------------------------
// Health check
// --------------------------------------------------

app.get("/api/health", (req, res) => {

    res.json({
        success: true,
        status: "OK",
        message: "API server is running"
    });

});


// --------------------------------------------------
// Start server
// --------------------------------------------------

app.listen(PORT, "0.0.0.0", () => {

    console.log("");
    console.log("======================================");
    console.log("      Docker Network Demo");
    console.log("======================================");
    console.log(`Application: http://127.0.0.1:${PORT}`);
    console.log(`API:         http://127.0.0.1:${PORT}/api/network`);
    console.log(`Health:      http://127.0.0.1:${PORT}/api/health`);
    console.log("======================================");
    console.log("");

});