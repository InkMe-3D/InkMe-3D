// routes/ai.js
const express = require("express");
const router = express.Router();
const { OpenAI } = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Endpoint for content moderation
router.post("/moderate-content", async (req, res) => {
  try {
    const { imageData } = req.body;

    if (!imageData) {
      return res.status(400).json({ error: "Image data is required" });
    }

    if (!process.env.OPENAI_API_KEY) {
      console.warn("OpenAI API key not configured. Skipping content moderation.");
      return res.json({
        isInappropriate: false,
        reason: "API key not configured."
      });
    }

    const payload = {
      "model": "gpt-4o",
      "messages": [{
        "role": "user",
        "content": [{
          "type": "text",
          "text": "Analyze the following image for inappropriate content. Check for graphic violence, gore, blood, hateful symbols, nudity, or sexually explicit material. Respond with a single JSON object with two keys: 'isInappropriate' (boolean) and 'reason' (a string, providing a brief explanation in Vietnamese if inappropriate, or 'an toàn' if not). Do not include any text outside of the JSON object."
        }, {
          "type": "image_url",
          "image_url": {
            "url": imageData,
            "detail": "low"
          }
        }]
      }],
      "max_tokens": 300
    };

    const response = await openai.chat.completions.create(payload);

    if (!response.choices || !response.choices[0]) {
      return res.json({
        isInappropriate: false,
        reason: "Invalid response from AI."
      });
    }

    const content = response.choices[0].message.content;

    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("Invalid response from OpenAI, couldn't find JSON:", content);
      return res.json({
        isInappropriate: false,
        reason: "Invalid response from AI."
      });
    }

    const parsedContent = JSON.parse(jsonMatch[0]);

    res.json({
      isInappropriate: parsedContent.isInappropriate,
      reason: parsedContent.reason
    });

  } catch (error) {
    console.error('Error in content moderation:', error);
    res.json({
      isInappropriate: false,
      reason: "An error occurred during check."
    });
  }
});

router.post("/chat", async (req, res) => {
  const { thread_id, message, images = [] } = req.body;

  try {
    // 1. Tạo hoặc lấy thread
    const thread = thread_id
      ? await openai.beta.threads.retrieve(thread_id)
      : await openai.beta.threads.create();

    // 2. Upload ảnh nếu có
    const fileIds = [];
    for (const img of images) {
      const buffer = Buffer.from(img.dataUrl.split(",")[1], "base64");
      const upload = await openai.files.create({
        purpose: "assistants",
        file: buffer,
        filename: img.name,
      });
      fileIds.push(upload.id);
    }

    // 3. Gửi message vào thread
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: message,
      attachments: fileIds.map((id) => ({
        file_id: id,
        tools: [{ type: "file" }],
      })),
    });

    // 4. Tạo "run" để Assistant trả lời, và stream kết quả
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const stream = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: process.env.OPENAI_ASSISTANT_ID,
      stream: true,
    });

    for await (const event of stream) {
      if (event.event === "thread.message.delta") {
        const delta = event.data.delta.content?.[0]?.text?.value || "";
        res.write(`data:${delta}\n\n`);
      } else if (event.event === "thread.run.completed") {
        res.write(`event:done\ndata:${thread.id}\n\n`);
        res.end();
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
