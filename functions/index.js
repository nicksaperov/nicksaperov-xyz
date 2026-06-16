const {onDocumentCreated} = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");

admin.initializeApp();

// Paste your Google Chat Webhook URL here
const CHAT_WEBHOOK_URL = "https://chat.googleapis.com/v1/spaces/AAQASiqCp9E/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=TAnGH7RREpvBEz6Id2OuqM79QahDbKN0EMb9kM_464M";

exports.publishLeadToChat = onDocumentCreated(
    "leads/{leadId}",
    async (event) => {
      try {
        const snap = event.data;
        if (!snap) return null;

        const newLead = snap.data();
        const name = newLead.name || "Anonymous Prospect";
        const email = newLead.email || "No email provided";
        const msg = newLead.message || "No message content";

        const payload = {
          text: "🚀 *New Lead Captured (nicksaperov.xyz)*\n\n" +
          `*Name:* ${name}\n*Email:* ${email}\n*Message:* ${msg}`,
        };

        const response = await fetch(CHAT_WEBHOOK_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          console.error(
              `Chat API Error: ${response.status} ${response.statusText}`,
          );
        } else {
          console.log(
              `Successfully dispatched Lead ID: ${event.params.leadId}`,
          );
        }

        return null;
      } catch (error) {
        console.error("Pipeline Egress Error:", error);
        return null;
      }
    },
);
