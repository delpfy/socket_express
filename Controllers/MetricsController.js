import { google } from "googleapis";

export const getCurrentUsers = async (req, res) => {
  try {
    const serviceAccount = JSON.parse(
      process.env.SERVICE_ACCOUNT_KEY.split(String.raw`\\n`).join("\\n")
    );
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
      country: row.dimensionValues[0].value,
      activeUsers: row.metricValues[0].value,
    }));

    res.json({ activeUsers });
  } catch (error) {
    console.error("Error fetching GA4 real-time data:", error);
    res.status(500).json({ error: "Failed to fetch real-time data" });
  }
};

export const getNewUsersLastMonth = async (req, res) => {
  try {
    const serviceAccount = JSON.parse(
      process.env.SERVICE_ACCOUNT_KEY.split(String.raw`\\n`).join("\\n")
    );
    const jwtClient = new google.auth.JWT(
      serviceAccount.client_email,
      null,
      serviceAccount.private_key,
      ["https://www.googleapis.com/auth/analytics.readonly"]
    );

    await jwtClient.authorize();

    const analyticsData = google.analyticsdata("v1beta");

    const propertyId = "properties/" + process.env.PROPERTY_ID;

    const response = await analyticsData.properties.runReport({
      auth: jwtClient,
      property: propertyId,
      requestBody: {
        dateRanges: [{ startDate: "30daysAgo", endDate: "yesterday" }],
        metrics: [{ name: "newUsers" }],
      },
    });

    const totalNewUsers =
      response.data.rows?.reduce(
        (total, row) => total + parseInt(row.metricValues[0].value, 10),
        0
      ) || 0;

    res.json({ totalNewUsers });
  } catch (error) {
    console.error("Error fetching GA4 data:", error);
    res.status(500).json({ error: "Failed to fetch GA4 data" });
  }
};

export const getAverageSessionDuration = async (req, res) => {
  try {
    const serviceAccount = JSON.parse(
      process.env.SERVICE_ACCOUNT_KEY.split(String.raw`\\n`).join("\\n")
    );
    const jwtClient = new google.auth.JWT(
      serviceAccount.client_email,
      null,
      serviceAccount.private_key,
      ["https://www.googleapis.com/auth/analytics.readonly"]
    );

    await jwtClient.authorize();

    const analyticsData = google.analyticsdata("v1beta");

    const propertyId = "properties/" + process.env.PROPERTY_ID;

    const response = await analyticsData.properties.runReport({
      auth: jwtClient,
      property: propertyId,
      requestBody: {
        dateRanges: [{ startDate: "30daysAgo", endDate: "yesterday" }],
        metrics: [{ name: "averageSessionDuration" }],
      },
    });

    const averageSessionDuration =
      response.data.rows?.[0]?.metricValues?.[0]?.value || "0";

    res.json({ averageSessionDuration });
  } catch (error) {
    console.error("Error fetching GA4 data:", error);
    res.status(500).json({ error: "Failed to fetch GA4 data" });
  }
};

export const getTotalSessionsLastMonth = async (req, res) => {
  try {
    const serviceAccount = JSON.parse(
      process.env.SERVICE_ACCOUNT_KEY.split(String.raw`\\n`).join("\\n")
    );
    const jwtClient = new google.auth.JWT(
      serviceAccount.client_email,
      null,
      serviceAccount.private_key,
      ["https://www.googleapis.com/auth/analytics.readonly"]
    );

    await jwtClient.authorize();

    const analyticsData = google.analyticsdata("v1beta");

    const propertyId = "properties/" + process.env.PROPERTY_ID;

    const response = await analyticsData.properties.runReport({
      auth: jwtClient,
      property: propertyId,
      requestBody: {
        dateRanges: [{ startDate: "30daysAgo", endDate: "yesterday" }],
        metrics: [{ name: "sessions" }],
      },
    });

    const totalSessions =
      response.data.rows?.[0]?.metricValues?.[0]?.value || "0";

    res.json({ totalSessions });
  } catch (error) {
    console.error("Error fetching GA4 data:", error);
    res.status(500).json({ error: "Failed to fetch GA4 data" });
  }
};

export const getPageViewsByCategory = async (req, res) => {
  try {
    const serviceAccount = JSON.parse(
      process.env.SERVICE_ACCOUNT_KEY.split(String.raw`\\n`).join("\\n")
    );
    const jwtClient = new google.auth.JWT(
      serviceAccount.client_email,
      null,
      serviceAccount.private_key,
      ["https://www.googleapis.com/auth/analytics.readonly"]
    );

    await jwtClient.authorize();

    const analyticsData = google.analyticsdata("v1beta");

    const propertyId = "properties/" + process.env.PROPERTY_ID;

    const response = await analyticsData.properties.runReport({
      auth: jwtClient,
      property: propertyId,
      requestBody: {
        dateRanges: [{ startDate: "30daysAgo", endDate: "yesterday" }],
        dimensions: [{ name: "pagePath" }],
        metrics: [{ name: "screenPageViews" }],
      },
    });

    const categories = {
      "/Monitori": "Монітори",
      "/Komp'yuterni-komplektuyuchi": "Комп'ютерні комплектуючі",
      "/Gejming": "Геймінг",
      "/Merezheve-obladnannya": "Мережеве обладнання",
      "/Aksesuari-dlya-elektroniki": "Аксесуари для електроніки",
      "/Kabeli-ta-perehidniki": "Кабелі та перехідники",
      "/Noutbuki": "Ноутбуки",
      "/Komp'yuteri": "Комп'ютери",
    };

    const categoryPageViews = Object.keys(categories).map((slug) => {
      const totalViews =
        response.data.rows
          ?.filter((row) => row.dimensionValues[0].value.startsWith(slug))
          .reduce(
            (total, row) => total + parseInt(row.metricValues[0].value, 10),
            0
          ) || 0;

      return { category: categories[slug], pageViews: totalViews };
    });

    res.json({ categoryPageViews });
  } catch (error) {
    console.error("Error fetching GA4 data:", error);
    res.status(500).json({ error: "Failed to fetch GA4 data" });
  }
};
