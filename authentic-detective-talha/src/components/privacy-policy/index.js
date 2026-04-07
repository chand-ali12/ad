import { Box, List, ListItem, Typography } from "@mui/material";
import { commonStyles } from "@/commonStyles";

const purposeForCollecting = [
  "To process creating your account;",
  "To process fees and subscriptions;",
  "To send transactional messages (such as account information);",
  "To send you surveys, marketing communications, promotional offers, and other information you’ve requested;",
  "To personalize our communications;",
  "To provide customer service;",
  "For our everyday business purposes in accordance with the law, such as for legal and other information you’ve requested;",
  "To personalize our communications;",
  "For our everyday business purposes in accordance with the law, such as for legal and regulatory compliance, security and fraud detection, and/or to enforce our rights.",
];

const categoriesData = [
  "The ‘Authentic Detective group family of companies’.",
  "Our partners to whom you’ve instructed us to send your information so they can communicate with you;",
  "Vendors who match and serve our targeted advertisements on social media platforms and other third-party websites;",
  "Our Service Providers that maintain our customer database; provide data storage processing; send communications on our behalf; help improve your online experience; process your payments; and provide fraud monitoring and detection services.",
];

const informationData = [
  "You and your computer or devices when you interact with the Site. For example, when you visit our Sites, our server logs record your IP address and other information;",
  "Automatically, via technologies such as cookies, web beacons, and pixels, when you visit our Sites;",
  "Third parties, including analytics providers and advertising partners who place cookies, web beacons, pixels, and other tracking technology on the Sites.",
];

const purposeData = [
  "To identify you and your computer or device and remember your preference;",
  "To improve our services and your browsing experience;",
  "To measure the effectiveness of our marketing and advertising campaigns;",
  "For our everyday business purposes, in accordance with the law, such as for legal and regulatory compliance, security and fraud detection, and/or to enforce our rights.",
];

const categoriesOfOtherEntities = [
  "The Authentic Detective group family of companies;",
  "Vendors who match and serve our targeted advertisements on social media platforms and other third-party websites;",
  "Our Service Providers that provide data storage processing, advertising and traffic analytics, and help improve your online experience.",
];

const relationshipList = [
  "You, when you interact with us or our Sites;",
  "Third parties that provide access to information you make publicly available, such as social media.",
];

const representativeDataList = [
  "Personal and household characteristics, demographic data, and preferences, such as your age range, gender, marital and family status, hobbies and interests;",
  "Membership, loyalty and rewards program data;",
  "Household demographic data;",
  "Education, employment, and professional information;",
  "Social-media engagement.",
];

const purposeForCollectingSharing = [
  "To administer your account with us;",
  "To personalize our communications;",
  "To conduct analytics on our marketing strategies;",
  "To improve our services and products and your browsing experience;",
  "For our everyday business purposes, in accordance with the law, such as for legal and regulatory compliance, security and fraud detection, and/or to enforce our rights.",
];

const categoriesOfOtherEntitiesInfo = [
  "The Authentic Detective group family of companies;",
  "Vendors who match and serve our targeted advertisements on social media platforms and other third-party websites;",
  "Our Service Providers that maintain our customer database, provide data storage processing, and send communications on our behalf.",
];

const FinancialInformation = [
  "You;",
  "Payment processors and other financial institutions.",
];

const purposeForCollectingPeronal = [
  "To record and process your account and subscription;",
  "To fulfill our relationship with you;",
  "For fraud monitoring and detection purposes;",
  "For our everyday business purposes, in accordance with the law, such as for legal and regulatory compliance and/or to enforce our rights.",
];

const avoidVisual = [
  "You, when you provide photographs as a part of your account or anything you upload to the Site;",
  "Third parties that provide access to information you make publicly available, such as social media.",
];

const privacyRights = [
  "The right to know what Personal Information we have collected and how we have used and disclosed that Personal Information.",
  "The right to request deletion of your Personal Information.",
  "The right to opt-out: We do not and will not sell your Personal Information, but we may share your Personal Information (including your Contact Information, Technical Information, and Relationship Information) with social media platforms and other advertising partners that will use that information to match and serve our targeted advertisements on the social media platforms and other third-party websites. We do not control and are not responsible for the social media platforms’ or advertising partners’ processing of your Personal Information. You can opt out of this sharing on a vendor-by-vendor basis here. You can also opt out of our use of your Personal Information for targeted advertising purposes by emailing support@authenticdetective.com",
  "The right to be free from discrimination relating to the exercise of any of your privacy rights.",
];

const PrivacyPolicy = () => {
  return (
    <Box
      sx={{
        paddingRight: {
          xs: "15px",
          sm: "15px",
          md: "15px",
          lg: "30px",
        },
        paddingLeft: {
          xs: "15px",
          sm: "15px",
          md: "15px",
          lg: "45px",
        },
      }}
    >
      <Typography
        sx={{
          ...commonStyles.commonHeadingStyles,
          textAlign: "center",
          mt: {
            xs: "23%",
            sm: "15%",
            md: "10%",
            lg: "8%",
          },
        }}
      >
        Privacy Policy
      </Typography>
      {/* Section 1 */}
      <Typography
        sx={{
          ...commonStyles.commonSubHeadingStyles,
          mt: 4,
        }}
      >
        1. About Us
      </Typography>
      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        {`This website ('Site') is operated by Authentic Detective LLC., a New
        Jersey Corporation ('Authentic Detective, 'we', 'us' and/or 'our'). The
        business responsible for your Personal Information is Authentic
        Detective LLC company with whom you contract as a user (' Authentic
        Detective', 'we', 'us' and/or 'our').`}
      </Typography>
      {/* Section 2 */}
      <Typography
        sx={{
          ...commonStyles.commonSubHeadingStyles,
        }}
      >
        2. Purpose of the Policy
      </Typography>
      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        {`This privacy policy ('Policy') describes how we collect, use and share
        Personal Information that we collect from you as a user of this Site
        ('you' or 'your' as applicable) and the privacy rights California
        residents may have relating to their Personal Information under the
        California Consumer Privacy Act ('CCPA') and how to exercise those
        rights.`}
      </Typography>
      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        {`'Personal Information' as used in this Policy means any information that
        identifies, relates to, describes, is reasonably capable of being
        associated with, or could reasonably be linked, directly or indirectly,
        with an individual or, if required by applicable law, a household. All
        other capitalized but undefined terms shall have the meanings assigned
        to them in applicable laws.`}
      </Typography>
      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        By using our Site or submitting your Personal Information you are taken
        to accept the terms of this Policy. If you do not agree to this Policy,
        please do not access the Site or otherwise submit Personal Information
        to us.
      </Typography>
      {/* Section 3 */}
      <Typography
        sx={{
          ...commonStyles.commonSubHeadingStyles,
        }}
      >
        3. Personal Information collection, use and disclosure
      </Typography>
      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        The following describes the categories and sources of Personal
        Information we collect, examples of the types of information that fall
        within each category, how we Personal Information, and how we disclose
        Personal Information.
      </Typography>
      <Typography
        sx={{
          ...commonStyles.commonSubHeadingStyles,
        }}
      ></Typography>
      {/* Section 3.1 */}
      <Typography
        sx={{
          ...commonStyles.commonSubHeadingStyles,
        }}
      >
        CONTACT INFORMATION:
      </Typography>
      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        We collect this type of information from:
      </Typography>
      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        You, when you create an account and use our Site platform. This category
        includes name, address, email address.
      </Typography>
      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        We may also collect Contact Information for people connected to you,
        such as your family members or authorized users of your account.
      </Typography>
      <Typography
        sx={{
          ...commonStyles.commonSubHeadingStyles,
        }}
      >
        Purpose for collecting, using, and sharing the Personal Information
      </Typography>
      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        We use Contact Information to identify you and communicate with you,
        including:
      </Typography>
      {purposeForCollecting.map((item, index) => (
        <List sx={{ listStyleType: "disc", pl: { xs: 2, sm: 5 } }} key={index}>
          <ListItem
            sx={{
              pl: 0,
              display: "list-item",

              ...commonStyles.commonTextStyles,
            }}
          >
            {item}
          </ListItem>
        </List>
      ))}
      <Typography
        sx={{
          ...commonStyles.commonSubHeadingStyles,
        }}
      >
        Categories of other entities to whom Personal Information is disclosed
      </Typography>
      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        We may disclose Contact Information to:
      </Typography>
      {categoriesData.map((item, index) => (
        <List sx={{ listStyleType: "disc", pl: { xs: 2, sm: 5 } }} key={index}>
          <ListItem
            sx={{
              pl: 0,
              display: "list-item",

              ...commonStyles.commonTextStyles,
            }}
          >
            {item}
          </ListItem>
        </List>
      ))}

      {/* Section 3.2 */}
      <Typography
        sx={{
          ...commonStyles.commonSubHeadingStyles,
        }}
      >
        GOVERNMENT IDENTIFICATION INFORMATION:
      </Typography>
      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        We may collect this type of information from you, if provided in
        connection with your account.
      </Typography>
      <Typography
        sx={{
          ...commonStyles.commonSubHeadingStyles,
        }}
      >
        Representative data elements
      </Typography>
      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        {`Data elements in this category may include a copy of your passport,
        driver's license, or birth certificate.`}
      </Typography>
      <Typography
        sx={{
          ...commonStyles.commonSubHeadingStyles,
        }}
      >
        Purpose for collecting, using, and sharing the Personal Information
      </Typography>
      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        We may collect Government Identification Information in order to allow
        us to keep the buyers secured and protected.
      </Typography>
      {/* Section 3.3 */}
      <Typography
        sx={{
          ...commonStyles.commonSubHeadingStyles,
        }}
      >
        TECHNICAL INFORMATION:
      </Typography>
      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        We collect this type of information from:
      </Typography>
      {informationData.map((item, index) => (
        <List sx={{ listStyleType: "disc", pl: { xs: 2, sm: 5 } }} key={index}>
          <ListItem
            sx={{
              pl: 0,
              display: "list-item",

              ...commonStyles.commonTextStyles,
            }}
          >
            {item}
          </ListItem>
        </List>
      ))}
      <Typography
        sx={{
          ...commonStyles.commonSubHeadingStyles,
        }}
      >
        Representative data elements
      </Typography>
      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        Data elements in this category include IP address, device identifiers
        and characteristics, location information, browser type and settings,
        the date and time of your request, and other information regarding the
        interaction with our Sites.
      </Typography>
      <Typography
        sx={{
          ...commonStyles.commonSubHeadingStyles,
        }}
      >
        Purpose for collecting, using, and sharing the Personal Information
      </Typography>
      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        We use Technical Information:
      </Typography>
      {purposeData.map((item, index) => (
        <List sx={{ listStyleType: "disc", pl: { xs: 2, sm: 5 } }} key={index}>
          <ListItem
            sx={{
              pl: 0,
              display: "list-item",

              ...commonStyles.commonTextStyles,
            }}
          >
            {item}
          </ListItem>
        </List>
      ))}
      <Typography
        sx={{
          ...commonStyles.commonSubHeadingStyles,
        }}
      >
        Categories of other entities to whom Personal Information is disclosed
      </Typography>
      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        We may disclose Technical Information to:
      </Typography>
      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        {categoriesOfOtherEntities.map((item, index) => (
          <List
            sx={{ listStyleType: "disc", pl: { xs: 2, sm: 5 } }}
            key={index}
          >
            <ListItem
              sx={{
                pl: 0,
                display: "list-item",

                ...commonStyles.commonTextStyles,
              }}
            >
              {item}
            </ListItem>
          </List>
        ))}
      </Typography>
      {/* Section 3.4 */}
      <Typography
        sx={{
          ...commonStyles.commonSubHeadingStyles,
        }}
      >
        RELATIONSHIP INFORMATION:
      </Typography>
      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        We collect this type of information from:
      </Typography>
      {relationshipList.map((item, index) => (
        <List sx={{ listStyleType: "disc", pl: { xs: 2, sm: 5 } }} key={index}>
          <ListItem
            sx={{
              pl: 0,
              display: "list-item",

              ...commonStyles.commonTextStyles,
            }}
          >
            {item}
          </ListItem>
        </List>
      ))}
      <Typography
        sx={{
          ...commonStyles.commonSubHeadingStyles,
        }}
      >
        Representative data elements
      </Typography>
      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        Data elements in this category include:
      </Typography>

      {representativeDataList.map((item, index) => (
        <List sx={{ listStyleType: "disc", pl: { xs: 2, sm: 5 } }} key={index}>
          <ListItem
            sx={{
              pl: 0,
              display: "list-item",

              ...commonStyles.commonTextStyles,
            }}
          >
            {item}
          </ListItem>
        </List>
      ))}
      <Typography
        sx={{
          ...commonStyles.commonSubHeadingStyles,
        }}
      >
        Purpose for collecting, using, and sharing the Personal Information
      </Typography>

      {purposeForCollectingSharing.map((item, index) => (
        <List sx={{ listStyleType: "disc", pl: { xs: 2, sm: 5 } }} key={index}>
          <ListItem
            sx={{
              pl: 0,
              display: "list-item",

              ...commonStyles.commonTextStyles,
            }}
          >
            {item}
          </ListItem>
        </List>
      ))}
      <Typography
        sx={{
          ...commonStyles.commonSubHeadingStyles,
        }}
      >
        Categories of other entities to whom Personal Information is disclosed
      </Typography>
      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        We may disclose Relationship Information to:
      </Typography>

      {categoriesOfOtherEntitiesInfo.map((item, index) => (
        <List sx={{ listStyleType: "disc", pl: { xs: 2, sm: 5 } }} key={index}>
          <ListItem
            sx={{
              pl: 0,
              display: "list-item",

              ...commonStyles.commonTextStyles,
            }}
          >
            {item}
          </ListItem>
        </List>
      ))}
      {/* Section 3.5 */}
      <Typography
        sx={{
          ...commonStyles.commonSubHeadingStyles,
        }}
      >
        FINANCIAL INFORMATION***:
      </Typography>
      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        We collect this type of information from:
      </Typography>
      {FinancialInformation.map((item, index) => (
        <List sx={{ listStyleType: "disc", pl: { xs: 2, sm: 5 } }} key={index}>
          <ListItem
            sx={{
              pl: 0,
              display: "list-item",

              ...commonStyles.commonTextStyles,
            }}
          >
            {item}
          </ListItem>
        </List>
      ))}
      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        ***We do not directly collect or process your Financial Information; it
        is collected directly by our sellers or payment services provider. See
        the Payment Information section below for more information regarding our
        handling of Financial Information.
      </Typography>
      <Typography
        sx={{
          ...commonStyles.commonSubHeadingStyles,
        }}
      >
        Representative data elements
      </Typography>
      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        Data elements in this category include payment card information and bank
        account number and details (if you use automated payments).
      </Typography>
      <Typography
        sx={{
          ...commonStyles.commonSubHeadingStyles,
        }}
      >
        Purpose for collecting, using, and sharing the Personal Information
      </Typography>
      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        We use Financial Information:
      </Typography>

      {purposeForCollectingPeronal.map((item, index) => (
        <List sx={{ listStyleType: "disc", pl: { xs: 2, sm: 5 } }} key={index}>
          <ListItem
            sx={{
              pl: 0,
              display: "list-item",

              ...commonStyles.commonTextStyles,
            }}
          >
            {item}
          </ListItem>
        </List>
      ))}

      <Typography
        sx={{
          ...commonStyles.commonSubHeadingStyles,
        }}
      >
        Categories of other entities to whom Personal Information is disclosed
      </Typography>
      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        Financial Information, which is directly collected by our payment
        services processor, may be disclosed to the Fine D3sign group family of
        companies for the same purposes for which it was collected and used.
      </Typography>
      {/* Section 3.6 */}
      <Typography
        sx={{
          ...commonStyles.commonSubHeadingStyles,
        }}
      >
        AUDIO/VISUAL INFORMATION:
      </Typography>

      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        We collect this type of information from:
      </Typography>

      {avoidVisual.map((item, index) => (
        <List sx={{ listStyleType: "disc", pl: { xs: 2, sm: 5 } }} key={index}>
          <ListItem
            sx={{
              pl: 0,
              display: "list-item",

              ...commonStyles.commonTextStyles,
            }}
          >
            {item}
          </ListItem>
        </List>
      ))}

      <Typography
        sx={{
          ...commonStyles.commonSubHeadingStyles,
        }}
      >
        Representative data elements
      </Typography>

      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        Data elements in this category include photographs and video images of
        you or others in the photos.
      </Typography>

      <Typography
        sx={{
          ...commonStyles.commonSubHeadingStyles,
        }}
      >
        Purpose for collecting, using, and sharing the Personal Information
      </Typography>

      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        We use Audio/Visual Information for security and fraud monitoring and
        detection purposes, as well as for promotions and marketing and for our
        everyday business purposes, in accordance with the law, such as for
        legal and regulatory compliance and/or to enforce our rights.
      </Typography>

      <Typography
        sx={{
          ...commonStyles.commonSubHeadingStyles,
        }}
      >
        Categories of other entities to whom Personal Information is disclosed
      </Typography>

      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        We may disclose Audio/Visual Information to the Authentic Detective
        group family of companies and to our Service Providers that maintain our
        customer database, provide data storage processing, and provide security
        and fraud monitoring and detection services.
      </Typography>

      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        {`Please note that we may also share each of the categories of Personal
        Information above (1) if we sell our business or our company assets to a
        third party or (2) if we need to (i) comply with a legal obligation
        and/or judicial or regulatory proceedings, a court order or other legal
        process; (ii) enforce our Terms & Conditions or other applicable
        contract terms; or (iii) protect us, our users, our employees, or
        contractors against loss or damage.`}
      </Typography>

      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        {`We may anonymize, aggregate and de-identify the data that we collect; this anonymized, aggregated and de-identified data is no longer Personal Information. We may use this anonymized, aggregated and de-identified data for our own internal business purposes, including sharing it with our current and prospective users, business partners, our affiliated businesses, agents and other third parties for commercial, statistical and market research purposes. For example, to allow those parties to analyze patterns among groups of people, and conducting research on demographics, interests and behavior.

`}
      </Typography>

      <Typography
        sx={{
          ...commonStyles.commonSubHeadingStyles,
        }}
      >
        Location information:
      </Typography>

      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        We collect this type of information from:
      </Typography>

      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        - You
      </Typography>

      <Typography
        sx={{
          ...commonStyles.commonSubHeadingStyles,
        }}
      >
        Representative data elements
      </Typography>

      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        Data elements in this category may include IP address, geolocation,
        beacon based location, and GPS location.
      </Typography>

      <Typography
        sx={{
          ...commonStyles.commonSubHeadingStyles,
        }}
      >
        Purpose for collecting, using, and sharing the Personal Information
      </Typography>

      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        We use location information to provide the Services to you. We may also
        receive and store your location whenever our mobile applications are
        running, including when running in the background, if you enable our
        mobile apps to access such information in the course of using the
        Service. You may be able to limit or disallow our use of certain
        location data through your device or browser settings, for example by
        adjusting the settings for our applications in iOS or Android privacy
        settings.
      </Typography>

      <Typography
        sx={{
          ...commonStyles.commonSubHeadingStyles,
        }}
      >
        Categories of other entities to whom Personal Information is disclosed
      </Typography>

      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        We may share some non-identifiable, de-identified or aggregated
        information from or about you, such as location information, with third
        parties in connection with advertising programs and data analytics.
      </Typography>

      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        We share user information in the aggregate with third parties, such as
        businesses that are listed on the Site and content distributors. For
        example, we disclose the number of users that have been exposed to or
        interacted with advertisements, or that we believe visited the physical
        location of a particular business.
      </Typography>

      <Typography
        sx={{
          ...commonStyles.commonSubHeadingStyles,
        }}
      >
        4. Payment information
      </Typography>

      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        Any credit/debit card payments and other payments you may make through
        our Site will be processed by our third-party payment providers and the
        payment data you submit will be securely stored and encrypted by our
        payment service providers using up to date industry standards. Please
        note that we do not ourselves directly process or store the debit/credit
        card data that you submit.
      </Typography>

      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        We may arrange that card or payment data you submit in support of your
        account or subscription fee is stored for the purpose of processing
        and/or initiating your account or subscription. We store and use this
        card or payment information for the purpose of processing any future
        payments that you make as a member for additional goods and services. We
        will store this data in accordance with our legal obligations under
        applicable law and only for so long as legally permitted.
      </Typography>

      <Typography
        sx={{
          ...commonStyles.commonSubHeadingStyles,
        }}
      >
        5. Tracking and Do Not Track Disclosures
      </Typography>

      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        Please be advised that parties other than Authentic Detective may
        collect Personal Information about the online activities of the users of
        our Site over time and across different websites when a consumer uses
        our Site.
      </Typography>

      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        {`   Do Not Track ('DNT') is a privacy preference you can set in most
        browsers. If you enable DNT on your browser, we will honor your request
        not to be tracked across the Internet. For more information, including
        how to turn on DNT, visit allaboutdnt.com.`}
      </Typography>

      <Typography
        sx={{
          ...commonStyles.commonSubHeadingStyles,
        }}
      >
        6. Children
      </Typography>

      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        {` The Site is not directed to children who are under the age of 13. We do not knowingly collect Personal Information from children who are under 13. If you have reason to believe that a child under the age of 13 has provided Personal Information to us through the Site, please contact us and we will endeavor to delete that information from our databases.

`}
      </Typography>

      <Typography
        sx={{
          ...commonStyles.commonSubHeadingStyles,
        }}
      >
        7. Security
      </Typography>

      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        {` Where we have given you (or where you have chosen) a password or login which enables you to access certain restricted parts of our Site, you are responsible for doing everything you reasonably can to keep these details secret. You must not share your password or login details with anyone else.



`}
      </Typography>

      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        {` Unfortunately, the transmission of information over the internet or public communications networks can never be completely secure. We will take appropriate technical and organizational security measures to protect the Personal Information that you submit to us against unauthorized/unlawful access or loss, destruction or damage, although we cannot 100 per cent guarantee the security of Personal Information that you provide to us online.





`}
      </Typography>

      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        {` By using our direct messaging feature, you acknowledge that your messages may be monitored by (us) for the purpose of our compliance with applicable laws and your adherence to the Terms and Conditions. (We) will not share the contents of your messages with any third-parties but may use anonymized and/or aggregated data for the purpose of reporting or optimizing our services.







`}
      </Typography>

      <Typography
        sx={{
          ...commonStyles.commonSubHeadingStyles,
        }}
      >
        8. Personal Information retention
      </Typography>

      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        {` We will keep your Personal Information only for as long as is reasonably necessary for the purposes outlined in this Privacy Policy, or for the duration required by any legal, regulatory, accounting or reporting requirements, whichever is the longer. In particular, we retain account records for six years after expiration or termination of your account. We retain information submitted through the Site and the other websites we operate for two years following account closure or contact with you, as applicable. When you consent to receive marketing communications, we will keep your data until you unsubscribe.





`}
      </Typography>

      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        {` To determine the appropriate retention period for your Personal Information, we consider the amount, nature, and sensitivity of the Personal Information, the purposes for which we process your Personal Information, applicable legal requirements or operational retention needs, and whether we can achieve those purposes through other means.







`}
      </Typography>

      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        {` Upon expiration of the applicable retention period we will securely destroy your Personal Information in accordance with applicable laws and regulations. In some circumstances we may anonymize your Personal Information so that it can no longer be associated with you, in which case it is no longer Personal Information.









`}
      </Typography>

      <Typography
        sx={{
          ...commonStyles.commonSubHeadingStyles,
        }}
      >
        9. Your privacy rights
      </Typography>

      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        {` Certain applicable data protection laws give you specific rights in relation to your Personal Information. In particular, if you are a California resident and the processing of your Personal Information is governed by the CCPA, subject to applicable exceptions, you have the following privacy rights in relation to your Personal Information we have collected:





`}
      </Typography>

      {privacyRights.map((item, index) => (
        <List sx={{ listStyleType: "disc", pl: { xs: 2, sm: 5 } }} key={index}>
          <ListItem
            sx={{
              pl: 0,
              display: "list-item",

              ...commonStyles.commonTextStyles,
            }}
          >
            {item}
          </ListItem>
        </List>
      ))}

      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        {` Exercising Your Rights: California residents can exercise the above privacy rights by emailing us at support@authenticdetective.com







`}
      </Typography>

      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        {` Verification: In order to protect your Personal Information from unauthorized access or deletion, we may require you to verify your login credentials before you can submit a request to know or delete Personal Information. If you do not have an account with us, or if we suspect fraudulent or malicious activity, we may ask you to provide additional Personal Information for verification. If we cannot verify your identity, we will not provide or delete your Personal Information.









`}
      </Typography>

      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        {` Authorized Agents: You may submit a request to know or a request to delete your Personal Information through an authorized agent. If you do so, the agent must provide signed, written permission to act on your behalf and you may also be required to independently verify your identity with us.











`}
      </Typography>

      <Typography
        sx={{
          ...commonStyles.commonSubHeadingStyles,
        }}
      >
        10. Changes to our privacy policy
      </Typography>

      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        {` Any changes we may make to this Policy in the future will be posted on this page. Please check back frequently to see any updates or modifications. If required by the applicable law, we will notify you of any material or significant changes to this Policy.



`}
      </Typography>

      <Typography
        sx={{
          ...commonStyles.commonSubHeadingStyles,
        }}
      >
        11. Last updated
      </Typography>

      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        {` This Policy was last updated on August 26th, 2024





`}
      </Typography>

      <Typography
        sx={{
          ...commonStyles.commonSubHeadingStyles,
        }}
      >
        12. Contact
      </Typography>

      <Typography
        pt={1}
        pb={1}
        sx={{
          ...commonStyles.commonTextStyles,
        }}
      >
        {` Questions, comments or requests regarding this Policy should be addressed to 


`}
        <a
          href="mailto:support@authenticdetective.com"
          style={{ color: "blue" }}
        >
          support@authenticdetective.com
        </a>
      </Typography>
    </Box>
  );
};

export default PrivacyPolicy;
