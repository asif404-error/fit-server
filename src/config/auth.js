const { betterAuth } = require("better-auth");
const { mongodbAdapter } = require("better-auth/adapters/mongodb");
const { getDB } = require("./db");

const getAuth = () => {
  const db = getDB();

  return betterAuth({
    database: mongodbAdapter(db),
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 6,
    },
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      },
    },
    user: {
      additionalFields: {
        role: {
          type: "string",
          default: "user",
        },
        status: {
          type: "string",
          default: "active",
        },
        profileImage: {
          type: "string",
          default: "",
        },
      },
    },
    trustedOrigins: [process.env.CLIENT_URL],
  });
};

module.exports = { getAuth };