import { google } from "googleapis";

export const getCurrentUsers = async (req, res) => {
  try {
    const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_KEY);
    const jwtClient = new google.auth.JWT(
      serviceAccount.client_email,
      null,
      serviceAccount.private_key,
      ["https://www.googleapis.com/auth/analytics.readonly"]
    );

    await jwtClient.authorize();

    const analyticsData = google.analyticsdata("v1beta");

    const propertyId = "properties/" + process.env.PROPERTY_ID;

    const response = await analyticsData.properties.runRealtimeReport({
      auth: jwtClient,
      property: propertyId,
      requestBody: {
        dimensions: [{ name: "country" }],
        metrics: [{ name: "activeUsers" }],
      },
    });

    const activeUsers = response.data.rows.map((row) => ({
      /* country: row.dimensionValues[0].value, */
      activeUsers: row.metricValues[0].value,
    }));

    res.json({ activeUsers });
  } catch (error) {
    console.error("Error fetching GA4 real-time data:", error);
    res.status(500).json({ error: "Failed to fetch real-time data" });
  }
};
