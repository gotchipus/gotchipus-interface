const excludedPaths = [];

module.exports = {
  siteUrl: "https://gotchipus.com", 
  generateRobotsTxt: true, 
  exclude: excludedPaths.concat(["/[sitemap]"]), 
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: "*",
        disallow: excludedPaths, 
      },
    ],
  },
};