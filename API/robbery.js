let robberies = [];

export default async function handler(req, res) {
    // CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, DELETE, OPTIONS"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type"
    );

    // Handle browser preflight
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    // =========================
    // GET - Get active robberies
    // =========================
    if (req.method === "GET") {

        // Remove robberies older than 5 minutes
        const currentTime = Date.now();

        robberies = robberies.filter((robbery) => {
            return (
                currentTime - robbery.createdAt <
                5 * 60 * 1000
            );
        });

        return res.status(200).json({
            success: true,
            robberies: robberies
        });
    }


    // =========================
    // POST - Create robbery
    // =========================
    if (req.method === "POST") {

        const {
            location,
            time,
            robberyId
        } = req.body || {};

        // Check location
        if (!location) {
            return res.status(400).json({
                success: false,
                error: "Missing robbery location"
            });
        }

        // Create robbery
        const newRobbery = {
            id: robberyId || Date.now().toString(),

            location: location,

            time: time || "Unknown",

            createdAt: Date.now()
        };

        // Add to active robberies
        robberies.push(newRobbery);

        console.log(
            "New robbery received:",
            newRobbery
        );

        return res.status(200).json({
            success: true,
            message: "Robbery added successfully",
            robbery: newRobbery
        });
    }


    // =========================
    // DELETE - Remove robbery
    // =========================
    if (req.method === "DELETE") {

        const {
            robberyId
        } = req.body || {};

        if (!robberyId) {
            return res.status(400).json({
                success: false,
                error: "Missing robbery ID"
            });
        }

        // Remove matching robbery
        robberies = robberies.filter((robbery) => {
            return robbery.id !== robberyId;
        });

        return res.status(200).json({
            success: true,
            message: "Robbery removed"
        });
    }


    // =========================
    // Invalid method
    // =========================
    return res.status(405).json({
        success: false,
        error: "Method not allowed"
    });
}
