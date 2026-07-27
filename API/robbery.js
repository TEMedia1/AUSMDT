let robberies = [];

export default function handler(req, res) {
    // Allow your website to access the API
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, DELETE, OPTIONS"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type"
    );

    // Browser preflight request
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    // GET
    // Used by calls.html to get active robberies
    if (req.method === "GET") {

        // Remove robberies older than 5 minutes
        const now = Date.now();

        robberies = robberies.filter(function (robbery) {
            return now - robbery.createdAt < 300000;
        });

        return res.status(200).json({
            robberies: robberies
        });
    }


    // POST
    // Used by Roblox to create a new robbery
    if (req.method === "POST") {

        const {
            location,
            time,
            robberyId
        } = req.body || {};


        // Make sure location exists
        if (!location) {
            return res.status(400).json({
                success: false,
                error: "Location is required"
            });
        }


        // Create robbery
        const robbery = {
            id: robberyId || Date.now().toString(),

            location: location,

            time: time || "Unknown",

            createdAt: Date.now()
        };


        // Add robbery
        robberies.push(robbery);


        console.log(
            "New robbery:",
            robbery
        );


        return res.status(200).json({
            success: true,

            message: "Robbery added",

            robbery: robbery
        });
    }


    // DELETE
    // Removes a robbery
    if (req.method === "DELETE") {

        const {
            robberyId
        } = req.body || {};


        if (!robberyId) {
            return res.status(400).json({
                success: false,
                error: "Robbery ID is required"
            });
        }


        robberies = robberies.filter(function (robbery) {
            return robbery.id !== robberyId;
        });


        return res.status(200).json({
            success: true,
            message: "Robbery removed"
        });
    }


    // Method not supported
    return res.status(405).json({
        success: false,
        error: "Method not allowed"
    });
}
