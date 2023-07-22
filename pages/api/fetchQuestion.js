import Question from "../../models/Question"
import connectToDatabase from "../../middleware/mongoose"
connectToDatabase()
export default async function handler(req, res) {
    if (req.method == 'POST') {
        try {
            const questions = await Question.find({ "question_subject": req.body.question_subject, "question_language": req.body.question_language })
            res.status(200).json({ questions })
        }
        catch {
            res.status(500).json({ error: "Internal server error, Please try again :)" })
        }
    }

    else {
        res.status(404).json({ error: "This method is not allowed :)" })
    }
}
