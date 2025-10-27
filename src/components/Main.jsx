import React from "react"
import IngredientsList from "./IngredientsList"
import ClaudeRecipe from "./ClaudeRecipe"
import { getRecipeFromMistral} from "../ai"

export default function Main() {
    const [ingredients, setIngredients] = React.useState(
        []
    )
    const [recipe, setRecipe] = React.useState("")
    const recipeSectionRef = React.useRef(null)

    const [loading, setLoading] = React.useState(false)
    
    React.useEffect(() => {
        if ((recipe ||loading) && recipeSectionRef.current !== null) {
            recipeSectionRef.current.scrollIntoView({behavior: "smooth"})
        }
    }, [recipe, loading]) 

    // async function getRecipe() {
    //     setLoading(true)
    //     const recipeMarkdown = await getRecipeFromMistral(ingredients)
    //     console.log("Recipe returned:", recipeMarkdown)
    //     setRecipe(recipeMarkdown)
    //     setLoading(false)
    // }

    async function getRecipe() {
    setLoading(true);
    try {
        const res = await fetch('/.netlify/functions/recipe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ingredients }),
        });

        const data = await res.json();

        // Adjust this line based on how your AI response is structured
        const recipeMarkdown = data?.choices?.[0]?.message?.content || "No recipe found.";
        
        console.log("Recipe returned:", recipeMarkdown);
        setRecipe(recipeMarkdown);
    } catch (err) {
        console.error("Error fetching recipe:", err);
        setRecipe("❌ Something went wrong while generating your recipe.");
    } finally {
        setLoading(false);
    }
}

    function addIngredient(formData) {
        const newIngredient = formData.get("ingredient")
        setIngredients(prevIngredients => [...prevIngredients, newIngredient])
    }
    
    return (
        <main>
            <form action={addIngredient} className="add-ingredient-form">
                <input
                    type="text"
                    placeholder="e.g. oregano"
                    aria-label="Add ingredient"
                    name="ingredient"
                />
                <button>Add ingredient</button>
            </form>

            {ingredients.length > 0 &&
                <IngredientsList
                    ingredients={ingredients}
                    getRecipe={getRecipe}
                />
            }

            {(loading || recipe) && <ClaudeRecipe ref={recipeSectionRef} recipe={recipe} loading={loading}/>}
        </main>
    )
}