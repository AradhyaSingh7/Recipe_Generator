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

    async function getRecipe() {
        setLoading(true)
        const res = await fetch("/.netlify/functions/recipe", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ ingredients }),
});
const data = await res.json();
const recipeMarkdown = data.recipe || "⚠️ Sorry, I couldn't generate a recipe this time.";

        console.log("Recipe returned:", recipeMarkdown)
        setRecipe(recipeMarkdown)
        setLoading(false)
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