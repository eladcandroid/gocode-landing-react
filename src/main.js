const sdk = require("node-appwrite");

module.exports = async function (req, res) {
  const client = new sdk.Client();
  const messaging = new sdk.Messaging(client);

  // Set endpoint and project from environment variables
  client
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  // Parse the event payload
  let payload;
  try {
    payload = JSON.parse(req.body);
  } catch (e) {
    res.json({ success: false, error: "Invalid payload" });
    return;
  }

  // Extract lead data
  const lead = payload?.payload;
  if (!lead || !lead.email || !lead.message) {
    res.json({ success: false, error: "Missing lead data" });
    return;
  }

  // Prepare email content
  const subject = `New Lead from ${lead.source || "website"}`;
  const message = `You have a new lead!\n\nEmail: ${lead.email}\nMessage: ${lead.message}\nStatus: ${lead.status}\nSource: ${lead.source}\nContact Date: ${lead.contact_date}`;

  try {
    await messaging.createEmail(
      process.env.APPWRITE_EMAIL_TEMPLATE_ID, // You need to set this in the function environment
      ["gocodeweb@gmail.com"],
      subject,
      message
    );
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};
