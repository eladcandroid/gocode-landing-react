const sdk = require("node-appwrite");

module.exports = async function (req, res) {
  const client = new sdk.Client();
  const messaging = new sdk.Messaging(client);

  // Set endpoint and project from environment variables
  client
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  console.log("Function triggered with payload:", req.body);

  // Parse the event payload
  let payload;
  try {
    payload = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch (e) {
    console.error("Error parsing payload:", e);
    return res.json({ success: false, error: "Invalid payload" });
  }

  // Extract lead data from the event
  const lead = payload;
  if (!lead || !lead.email || !lead.message) {
    console.error("Missing lead data:", lead);
    return res.json({ success: false, error: "Missing lead data" });
  }

  // Prepare email content
  const subject = `🚀 New Lead from ${lead.source || "GoCode Website"}`;
  const htmlContent = `
    <h2>New Lead Alert!</h2>
    <p>You have received a new lead from your website:</p>
    <ul>
      <li><strong>Email:</strong> ${lead.email}</li>
      <li><strong>Message:</strong> ${lead.message}</li>
      <li><strong>Status:</strong> ${lead.status}</li>
      <li><strong>Source:</strong> ${lead.source}</li>
      <li><strong>Contact Date:</strong> ${lead.contact_date}</li>
      <li><strong>Created:</strong> ${
        lead.$createdAt || new Date().toISOString()
      }</li>
    </ul>
    <p>Please follow up with this lead as soon as possible!</p>
  `;

  const textContent = `New Lead Alert!

You have received a new lead from your website:
- Email: ${lead.email}
- Message: ${lead.message}
- Status: ${lead.status}
- Source: ${lead.source}
- Contact Date: ${lead.contact_date}
- Created: ${lead.$createdAt || new Date().toISOString()}

Please follow up with this lead as soon as possible!`;

  try {
    // Send email using Appwrite Messaging
    await messaging.createEmail(
      "unique()", // Generate unique message ID
      subject,
      htmlContent,
      [],
      ["gocodeweb@gmail.com"],
      [],
      [],
      [],
      textContent,
      false
    );

    console.log("Email sent successfully to gocodeweb@gmail.com");
    return res.json({ success: true, message: "Email notification sent" });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.json({ success: false, error: error.message });
  }
};
