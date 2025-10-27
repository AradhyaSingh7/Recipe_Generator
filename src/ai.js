export async function getRecipeFromMistral(ingredients) {
  const HF_TOKEN = import.meta.env.VITE_HF_ACCESS_TOKEN;

  try {
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
    console.log("Recipe API response:", data);

    return data?.choices?.[0]?.message?.content || "Sorry, I couldn't generate a recipe this time.";
  } catch (error) {
    console.error("Error fetching recipe:", error);
    return "⚠️ Sorry, I couldn't generate a recipe this time.";
  }
}
