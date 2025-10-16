import Resume from "../models/Resume.js";
import ai from "../configs/ai.js";

// Reusable function to handle AI content enhancement
const getEnhancedContent = async (systemPrompt, userContent) => {
    if (!userContent) {
        throw new Error('Missing required fields');
    }
    const response = await ai.chat.completions.create({
        model: process.env.OPENAI_MODEL,
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userContent },
        ],
    });
    return response.choices[0].message.content;
};

export const enhanceProfessionalSummary = async (req, res) => {
    try {
        const systemPrompt = "You are a resume writing expert. Enhance the professional summary in 1-2 compelling, ATS-friendly sentences, highlighting key skills and objectives. Return only the enhanced text.";
        const enhancedContent = await getEnhancedContent(systemPrompt, req.body.userContent);
        return res.status(200).json({ enhancedContent });
    } catch (error) {
        console.error("Error enhancing summary:", error.message);
        return res.status(500).json({ message: error.message });
    }
};

export const enhanceJobDescription = async (req, res) => {
    try {
        const systemPrompt = "You are a resume writing expert. Enhance the job description in 1-2 compelling, ATS-friendly sentences, highlighting key achievements. Return only the enhanced text.";
        const enhancedContent = await getEnhancedContent(systemPrompt, req.body.userContent);
        return res.status(200).json({ enhancedContent });
    } catch (error) {
        console.error("Error enhancing job description:", error.message);
        return res.status(500).json({ message: error.message });
    }
};

export const enhanceProjectDescription = async (req, res) => {
    try {
      const systemPrompt = "You are a resume writing expert. Enhance the project description in 1-2 compelling, ATS-friendly sentences, highlighting key technologies and outcomes. Return only the enhanced text.";
      const enhancedContent = await getEnhancedContent(systemPrompt, req.body.userContent);
      return res.status(200).json({ enhancedContent });
    } catch (error) {
      console.error("Error enhancing project description:", error.message);
      return res.status(500).json({ message: error.message });
    }
};

export const uploadAndParseResume = async (req, res) => {
    try {
        const { resumeText, title } = req.body;
        const userId = req.userId;

        if (!resumeText || !title) {
            return res.status(400).json({ message: 'Missing title or resume text' });
        }

        const userPrompt = `Extract data from this resume text: ${resumeText}. Provide the data in a valid JSON format...`; // (Full prompt)

        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
            messages: [
                { role: "system", content: "You are an expert AI..." },
                { role: "user", content: userPrompt },
            ],
            response_format: { type: 'json_object' }
        });

        const extractedData = response.choices[0].message.content;
        const parsedData = JSON.parse(extractedData);

        const newResume = await Resume.create({ userId, title, ...parsedData });
        res.status(201).json({ resumeId: newResume._id });

    } catch (error) {
        console.error("Error uploading resume:", error);
        return res.status(500).json({ message: "Failed to process resume." });
    }
};