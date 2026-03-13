// services/aiReviewService.js

export const simulateAIReview = (title, description) => {

    const text = `${title} ${description}`.toLowerCase()

    let decision
    let comment
    let score

    if (text.includes("fix") || text.includes("improve") || text.includes("optimize")) {

        decision = "approved"

        score = 85 + Math.floor(Math.random() * 10)

        comment = `
AI Review Result:

Strengths:
- Code improvements detected
- Logic appears optimized

Suggestions:
- Add additional comments for readability
- Ensure edge cases are handled

Final Decision: APPROVED
`

    } else {

        decision = "changes_requested"

        score = 50 + Math.floor(Math.random() * 20)

        comment = `
AI Review Result:

Issues Detected:
- Implementation description unclear
- Possible missing optimizations

Suggestions:
- Improve code structure
- Add better documentation

Final Decision: CHANGES REQUESTED
`
    }

    return { decision, comment, score }
}