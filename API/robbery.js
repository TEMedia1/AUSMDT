export default async function handler(req, res) {
    // Allow requests from your website
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    // Handle browser preflight requests
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    // Temporary test response
    if (req.method === "GET") {
        return res.status(200).json({
            status: "online",
            message: "Police MDT API is online"
        });
    }

    // Receive robbery information
    if (req.method === "POST") {
        const { location, time, robberyId } = req.body;

        if (!location) {
            return res.status(400).json({
                error: "Location is required"
            });
        }

        console.log("Robbery received:", {
            location,
            time,
            robberyId
        });

        return res.status(200).json({
            success: true,
            message: "Robbery received",
            robbery: {
                location,
                time,
                robberyId
            }
        });
    }

    return res.status(405).json({
        error: "Method not allowed"
    });
}
