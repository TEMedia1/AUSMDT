let registrations = [];

export default async function handler(req, res) {

    // ==========================================
    // CORS
    // ==========================================

    res.setHeader(
        "Access-Control-Allow-Origin",
        "*"
    );

    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, DELETE, OPTIONS"
    );

    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type"
    );


    // ==========================================
    // OPTIONS
    // ==========================================

    if (req.method === "OPTIONS") {

        return res.status(200).end();

    }


    // ==========================================
    // GET
    // ==========================================

    if (req.method === "GET") {

        const { rego, password } =
            req.query || {};


        // --------------------------------------
        // GET SPECIFIC REGISTRATION
        // --------------------------------------

        if (rego) {

            const registration =
                registrations.find(
                    item =>
                        item.rego.toLowerCase() ===
                        String(rego).toLowerCase()
                );


            if (!registration) {

                return res.status(404).json({

                    success: false,

                    error:
                        "Registration not found"

                });

            }


            // ----------------------------------
            // Password check
            // ----------------------------------

            if (
                password &&
                registration.password !== password
            ) {

                return res.status(403).json({

                    success: false,

                    error:
                        "Incorrect password"

                });

            }


            return res.status(200).json({

                success: true,

                registration:

                    registration

            });

        }


        // --------------------------------------
        // GET ALL REGISTRATIONS
        // Police lookup
        // --------------------------------------

        return res.status(200).json({

            success: true,

            registrations:

                registrations

        });

    }


    // ==========================================
    // POST
    // CREATE REGISTRATION
    // ==========================================

    if (req.method === "POST") {

        const {

            rego,

            rpName,

            discordUser,

            robloxUser,

            carModel,

            password

        } = req.body || {};


        // --------------------------------------
        // Required fields
        // --------------------------------------

        if (
            !rego ||
            !rpName ||
            !discordUser ||
            !robloxUser ||
            !carModel ||
            !password
        ) {

            return res.status(400).json({

                success: false,

                error:
                    "All fields are required"

            });

        }


        // --------------------------------------
        // Check duplicate registration
        // --------------------------------------

        const existing =
            registrations.find(
                item =>
                    item.rego.toLowerCase() ===
                    String(rego).toLowerCase()
            );


        if (existing) {

            return res.status(409).json({

                success: false,

                error:
                    "This registration already exists"

            });

        }


        // ======================================
        // CREATE RECORD
        // ======================================

        const newRegistration = {

            id:
                Date.now().toString(),

            rego:
                String(rego).toUpperCase(),

            rpName:

                rpName,

            discordUser:

                discordUser,

            robloxUser:

                robloxUser,

            carModel:

                carModel,

            password:

                password,

            warnings: [],

            tickets: [],

            notes: [],

            createdAt:

                Date.now()

        };


        registrations.push(
            newRegistration
        );


        console.log(

            "[REGO] New registration:",

            newRegistration.rego

        );


        return res.status(201).json({

            success: true,

            message:
                "Registration created",

            registration:

                newRegistration

        });

    }


    // ==========================================
    // PATCH
    // POLICE UPDATE RECORD
    // ==========================================

    if (req.method === "PATCH") {

        const {

            rego,

            type,

            message,

            officer

        } = req.body || {};


        if (
            !rego ||
            !type ||
            !message
        ) {

            return res.status(400).json({

                success: false,

                error:
                    "Registration, type and message are required"

            });

        }


        const registration =
            registrations.find(
                item =>
                    item.rego.toLowerCase() ===
                    String(rego).toLowerCase()
            );


        if (!registration) {

            return res.status(404).json({

                success: false,

                error:
                    "Registration not found"

            });

        }


        const record = {

            id:
                Date.now().toString(),

            message:

                message,

            officer:

                officer ||
                "Unknown Officer",

            createdAt:

                Date.now()

        };


        // --------------------------------------
        // WARNING
        // --------------------------------------

        if (type === "warning") {

            registration.warnings.push(
                record
            );

        }


        // --------------------------------------
        // TICKET
        // --------------------------------------

        else if (type === "ticket") {

            registration.tickets.push(
                record
            );

        }


        // --------------------------------------
        // NOTE
        // --------------------------------------

        else if (type === "note") {

            registration.notes.push(
                record
            );

        }


        else {

            return res.status(400).json({

                success: false,

                error:
                    "Invalid record type"

            });

        }


        return res.status(200).json({

            success: true,

            message:
                "Record updated",

            registration:

                registration

        });

    }


    // ==========================================
    // DELETE
    // POLICE DELETE REGISTRATION
    // ==========================================

    if (req.method === "DELETE") {

        const {

            rego

        } = req.body || {};


        if (!rego) {

            return res.status(400).json({

                success: false,

                error:
                    "Registration is required"

            });

        }


        const oldLength =
            registrations.length;


        registrations =
            registrations.filter(
                item =>
                    item.rego.toLowerCase() !==
                    String(rego).toLowerCase()
            );


        if (
            registrations.length ===
            oldLength
        ) {

            return res.status(404).json({

                success: false,

                error:
                    "Registration not found"

            });

        }


        return res.status(200).json({

            success: true,

            message:
                "Registration deleted"

        });

    }


    // ==========================================
    // INVALID METHOD
    // ==========================================

    return res.status(405).json({

        success: false,

        error:
            "Method not allowed"

    });

}
