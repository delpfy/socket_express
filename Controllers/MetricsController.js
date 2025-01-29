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

    const today = new Date();
    const year = today.getFullYear();
    const months = [
      "Січень",
      "Лютий",
      "Березень",
      "Квітень",
      "Травень",
      "Червень",
      "Липень",
      "Серпень",
      "Вересень",
      "Жовтень",
      "Листопад",
      "Грудень",
    ];

    const dateRanges = [];
    for (let i = 0; i < 13; i++) {
      const monthDate = new Date(today);
      monthDate.setMonth(today.getMonth() - i);

      const startDate = new Date(
        monthDate.getFullYear(),
        monthDate.getMonth(),
        1
      );
      const endDate = new Date(
        monthDate.getFullYear(),
        monthDate.getMonth() + 1,
        0
      );

      dateRanges.push({
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
      });
    }

    const monthlyNewUsers = [];

    for (const dateRange of dateRanges) {
      const response = await analyticsData.properties.runReport({
        auth: jwtClient,
        property: propertyId,
        requestBody: {
          dateRanges: [dateRange],
          metrics: [{ name: "newUsers" }],
        },
      });

      const totalNewUsers =
        response.data.rows?.reduce(
          (total, row) => total + parseInt(row.metricValues[0].value, 10),
          0
        ) || 0;

      const monthIndex = new Date(dateRange.startDate).getMonth();
      const year = new Date(dateRange.startDate).getFullYear();

      monthlyNewUsers.push({
        month:
          monthIndex + 1 == 12
            ? `Січень ${year + 1}`
            : `${months[monthIndex + 1]} ${year}`,
        sessions: totalNewUsers.toString(),
      });
    }

    res.json({ monthlyNewUsers });
  } catch (error) {
    console.error("Ошибка получения данных из GA4:", error);
    res.status(500).json({ error: "Не удалось получить данные из GA4" });
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

    const today = new Date();
    const year = today.getFullYear();
    const months = [
      "Січень",
      "Лютий",
      "Березень",
      "Квітень",
      "Травень",
      "Червень",
      "Липень",
      "Серпень",
      "Вересень",
      "Жовтень",
      "Листопад",
      "Грудень",
    ];

    const dateRanges = [];
    for (let i = 0; i < 13; i++) {
      const monthDate = new Date(today);
      monthDate.setMonth(today.getMonth() - i);

      const startDate = new Date(
        monthDate.getFullYear(),
        monthDate.getMonth(),
        1
      );
      const endDate = new Date(
        monthDate.getFullYear(),
        monthDate.getMonth() + 1,
        0
      );

      dateRanges.push({
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
      });
    }

    const monthlySessions = [];

    for (const dateRange of dateRanges) {
      const response = await analyticsData.properties.runReport({
        auth: jwtClient,
        property: propertyId,
        requestBody: {
          dateRanges: [dateRange],
          metrics: [{ name: "sessions" }],
          dimensions: [{ name: "month" }],
        },
      });

      const totalSessions =
        response.data.rows?.reduce(
          (total, row) => total + parseInt(row.metricValues[0].value, 10),
          0
        ) || 0;

      const monthIndex = new Date(dateRange.startDate).getMonth();
      const year = new Date(dateRange.startDate).getFullYear();

      monthlySessions.push({
        month:
          monthIndex + 1 == 12
            ? `Січень ${year + 1}`
            : `${months[monthIndex + 1]} ${year}`,
        sessions: totalSessions.toString(),
      });
    }

    res.json({ monthlySessions });
  } catch (error) {
    console.error("Ошибка получения данных из GA4:", error);
    res.status(500).json({ error: "Не удалось получить данные из GA4" });
  }
};

/* const response = await analyticsData.properties.runReport({
        auth: jwtClient,
        property: propertyId,
        requestBody: {
          dateRanges: [{ startDate, endDate }],
          metrics: [{ name: "sessions" }],
          dimensions: [{ name: "month" }],
        },
      }); */

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
