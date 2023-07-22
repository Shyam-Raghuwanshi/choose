import Question from "../../models/Question"
import connectToDatabase from "../../middleware/mongoose"
connectToDatabase()
export default async function handler(req, res) {
    if (req.method == 'POST') {
        try {
            for (let i = 0; i < req.body.length; i++) {
                const question = new Question({
                    "question_subject": req.body[i].question_subject,
                    "question_language": req.body[i].question_language,
                    "true_option": req.body[i].true_option,
                    "question": req.body[i].question,
                    "year": req.body[i].year,
                    "option_1": req.body[i].option_1,
                    "option_2": req.body[i].option_2,
                    "option_3": req.body[i].option_3,
                    "option_4": req.body[i].option_4,
                    "slug": req.body[i].slug
                })
                await question.save()

            }
            res.status(200).json({ success: "success" })
        }
        catch {
            res.status(500).json({ error: "Internal server error, Please try again :)" })
        }
    }

    else {
        res.status(404).json({ error: "This method is not allowed :)" })
    }
}
