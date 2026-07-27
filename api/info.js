let officers = [];

export default async function handler(req, res) {

    // =========================
    // CORS
    // =========================

    res.setHeader(
        "Access-Control-Allow-Origin",
        "*"
    );

    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, DELETE, OPTIONS"
    );

    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type"
    );


    // =========================
    // OPTIONS
    // =========================

    if (req.method === "OPTIONS") {

        return res.status(200).end();

    }


    // =========================
    // GET
    // Get all officers
    // =========================

    if (req.method === "GET") {

        return res.status(200).json({

            success: true,

            officers: officers

        });

    }


    // =========================
    // POST
    // Add / update officer
    // =========================

    if (req.method === "POST") {

        const {

            userId,

            username,

            displayName,

            rank

        } = req.body || {};


        // Check User ID

        if (!userId) {

            return res.status(400).json({

                success: false,

                error:
                    "Missing Roblox User ID"

            });

        }


        // Check if officer already exists

        const existingOfficer =
            officers.find(
                officer =>
                    String(
                        officer.userId
                    ) === String(userId)
            );


        // =========================
        // UPDATE EXISTING OFFICER
        // =========================

        if (existingOfficer) {

            existingOfficer.username =
                username ||
                existingOfficer.username;

            existingOfficer.displayName =
                displayName ||
                existingOfficer.displayName;

            existingOfficer.rank =
                rank ||
                existingOfficer.rank;


            return res.status(200).json({

                success: true,

                message:
                    "Officer updated",

                officer:
                    existingOfficer

            });

        }


        // =========================
        // CREATE OFFICER
        // =========================

        const newOfficer = {

            userId:
                String(userId),

            username:
                username ||
                "Unknown",

            displayName:
                displayName ||
                "Unknown",

            rank:
                rank ||
                "Not Set"

        };


        officers.push(
            newOfficer
        );


        console.log(
            "[MDT] Officer added:",
            newOfficer
        );


        return res.status(200).json({

            success: true,

            message:
                "Officer added",

            officer:
                newOfficer

        });

    }


    // =========================
    // DELETE
    // Remove officer
    // =========================

    if (req.method === "DELETE") {

        const {
            userId
        } = req.body || {};


        if (!userId) {

            return res.status(400).json({

                success: false,

                error:
                    "Missing Roblox User ID"

            });

        }


        officers =
            officers.filter(
                officer =>

                    String(
                        officer.userId
                    ) !== String(userId)

            );


        return res.status(200).json({

            success: true,

            message:
                "Officer removed"

        });

    }


    // =========================
    // INVALID METHOD
    // =========================

    return res.status(405).json({

        success: false,

        error:
            "Method not allowed"

    });

}
