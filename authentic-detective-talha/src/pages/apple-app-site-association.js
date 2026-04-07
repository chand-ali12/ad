// pages/apple-app-site-association.js

export async function getServerSideProps({ res }) {
  // Data for the JSON response
  const appleAppSiteAssociation = {
    applinks: {
      apps: [],
      details: [
        {
          appID: "6GH25N545N.com.techificent.AuthenticDetective",
          paths: ["ad/app/*"],
        },
      ],
    },
  };

  // Set the response content type to JSON
  res.setHeader("Content-Type", "application/json");
  res.statusCode = 200;

  // Send the JSON data
  res.end(JSON.stringify(appleAppSiteAssociation));

  // Since we are sending a custom response, we don't need to return props
  return { props: {} };
}

export default function AppleAppSiteAssociation() {
  // No UI component is needed, since we're just sending JSON
  return null;
}
