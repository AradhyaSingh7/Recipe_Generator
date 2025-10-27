import ReactMarkdown from "react-markdown"
import { forwardRef } from "react"

const ClaudeRecipe= forwardRef(function ClaudeRecipe(props, ref) {
    return (
        <section className="suggested-recipe-container" aria-live="polite" ref={ref}>
            <div className="chef-header">
                <img src="images/chef.png" alt="chef icon" className="chef-icon"></img>
            <h2>WhiskAI Recommends:</h2>
            </div>
            {props.loading ? (
                <div className="chef-loading">
                    <img src="images/chef.png" alt="chef hat loading" className="chef-hat" />
                    <p>WhiskAI is cooking up your recipe...</p>
                </div>) : (
        <ReactMarkdown>{props.recipe}</ReactMarkdown>
      )}
        </section>
    )
})
export default ClaudeRecipe