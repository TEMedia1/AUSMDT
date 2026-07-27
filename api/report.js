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
        "POST, OPTIONS"
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
    // ONLY ALLOW POST
    // ==========================================

    if (req.method !== "POST") {

        return res.status(405).json({

            success: false,

            error:
                "Method not allowed"

        });

    }


    // ==========================================
    // DISCORD WEBHOOK
    // ==========================================

    const WEBHOOK_URL = "https://discord.com/api/webhooks/1433782551092138177/Fdl0xsabAbQGDp8FWNJtLvBqxdkopGNEq5baQu1Brp38VVadfburU2BgmwjGKSaiY_QX"
        process.env.REPORT_WEBHOOK_URL;


    if (!WEBHOOK_URL) {

        console.error(
            "REPORT_WEBHOOK_URL is not configured."
        );

        return res.status(500).json({

            success: false,

            error:
                "Report system is not configured."

        });

    }


    // ==========================================
    // GET DATA
    // ==========================================

    const {

        reporterRPName,

        reporterRoblox,

        reporterDiscord,

        reportedRPName,

        reportedRoblox,

        reportedDiscord,

        reason,

        description,

        incidentDate,

        additionalInfo,

        evidenceImage

    } = req.body || {};


    // ==========================================
    // REQUIRED FIELDS
    // ==========================================

    if (

        !reporterRPName ||

        !reporterRoblox ||

        !reporterDiscord ||

        !reportedRPName ||

        !reportedRoblox ||

        !reportedDiscord ||

        !reason ||

        !description ||

        !incidentDate

    ) {

        return res.status(400).json({

            success: false,

            error:
                "Please complete all required fields."

        });

    }


    // ==========================================
    // LIMIT INPUT LENGTH
    // ==========================================

    if (

        reporterRPName.length > 100 ||

        reporterRoblox.length > 100 ||

        reporterDiscord.length > 100 ||

        reportedRPName.length > 100 ||

        reportedRoblox.length > 100 ||

        reportedDiscord.length > 100 ||

        reason.length > 200 ||

        description.length > 2000 ||

        additionalInfo.length > 2000

    ) {

        return res.status(400).json({

            success: false,

            error:
                "One or more fields are too long."

        });

    }


    // ==========================================
    // DISCORD EMBED
    // ==========================================

    const embed = {

        title:
            "🚨 New Community Report",

        description:
            "A new report has been submitted through the community report system.",

        color:
            15158332,

        fields: [

            {

                name:
                    "👤 Person Reporting",

                value:

                    "**RP Name:** " +
                    reporterRPName +

                    "\n**Roblox:** " +
                    reporterRoblox +

                    "\n**Discord:** " +
                    reporterDiscord,

                inline:
                    false

            },

            {

                name:
                    "⚠️ Reported Person",

                value:

                    "**RP Name:** " +
                    reportedRPName +

                    "\n**Roblox:** " +
                    reportedRoblox +

                    "\n**Discord:** " +
                    reportedDiscord,

                inline:
                    false

            },

            {

                name:
                    "📋 Reason",

                value:
                    reason,

                inline:
                    false

            },

            {

                name:
                    "📝 Description",

                value:
                    description,

                inline:
                    false

            },

            {

                name:
                    "📅 Incident Date / Time",

                value:
                    incidentDate,

                inline:
                    false

            },

            {

                name:
                    "ℹ️ Additional Information",

                value:

                    additionalInfo ||
                    "No additional information provided.",

                inline:
                    false

            }

        ],

        footer: {

            text:
                "Community Report System"

        },

        timestamp:
            new Date().toISOString()

    };


    // ==========================================
    // EVIDENCE IMAGE
    // ==========================================

    if (evidenceImage) {

        embed.image = {

            url:
                evidenceImage

        };

    }


    // ==========================================
    // SEND TO DISCORD
    // ==========================================

    try {

        const response =

            await fetch(

                WEBHOOK_URL,

                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:

                        JSON.stringify({

                            username:
                                "Community Reports",

                            embeds: [

                                embed

                            ]

                        })

                }

            );


        if (!response.ok) {

            throw new Error(

                "Discord returned " +
                response.status

            );

        }


        return res.status(200).json({

            success:
                true,

            message:
                "Report submitted successfully."

        });


    }

    catch (error) {

        console.error(

            "Report webhook error:",

            error

        );


        return res.status(500).json({

            success:
                false,

            error:
                "Unable to send report. Please try again later."

        });

    }

}
