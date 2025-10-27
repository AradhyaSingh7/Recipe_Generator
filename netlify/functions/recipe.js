// netlify/functions/recipe.js

export async function handler(event) {
  try {
    const { ingredients } = JSON.parse(event.body);

    // Use your Hugging Face key from Netlify env (NOT VITE_)
    const HF_TOKEN = process.env.HF_ACCESS_TOKEN;

    const response = await fetch("https://router.huggingface.co/together/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistralai/Mistral-7B-Instruct-v0.3",
        messages: [
          {
            role: "system",
            content: "You are Chef Claude, a helpful AI that writes fun and short recipe suggestions.",
          },
          {
            role: "user",
            content: `Write a quick recipe using the following ingredients: ${ingredients.join(", ")}.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const recipe =
      data?.choices?.[0]?.message?.content || "Sorry, I couldn't generate a recipe this time.";

    return {
      statusCode: 200,
      body: JSON.stringify({ recipe }),
    };
  } catch (error) {
    console.error("Error fetching recipe:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
