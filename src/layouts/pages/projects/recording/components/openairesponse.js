const axios = require('axios')
const { OpenAI } = require('openai');

const apiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI(apiKey);

async function getGPTResponse(prompt) {
 try {
  const completion = await openai.chat.completions.create({
   model: "gpt-4-1106-preview",
   messages: [{role: "system", content: "You are a proffesional summarizer and my personal assistant who summarizes the transcript of the input conversation according to the needs of the prompt. Make sure to pay attention to output a good structured response with a sharp eye for details."},
  {role: "user", content: prompt }],
  });
  return completion.choices[0].message.content;
 } catch (error) {
  console.error("error in OpenAI call:", error);
  throw error;
 }
}

export default getGPTResponse;