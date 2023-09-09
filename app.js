const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');

const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage });
const axios = require('axios');
const OPENAI_API_KEY = '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';
const openAIBaseURL = 'https://api.openai.com/v1/'
// const {  OpenAIApi , Configuration} =  require('openai');

// const configuration =  new Configuration ({
//     // organization: 'org-9tyUKi29EcsanBi1KfQala4O',
//     apiKey: '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'
// });

// const openAgent = new OpenAIApi(configuration);



const promptGenerator = (prompt) => {
    return `As a security experrt, analyse the email content inside triple pipes|||${prompt}|||  and list the possible security threats like 1) Phishing attack 2)Data loss and so on with bullet just headers without explaination `;
    // return `Analyse the file content inside triple pipes|||${prompt}||| and summarize possible threats`
}
const getCompletion =async (text) => {
    const data = {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: promptGenerator(text) }],
        temperature: 0.7,
      };
      
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      };
      
      try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', data, { headers });
        console.log(response.data);
        return response.data;
      } catch (error) {
        console.error(error);
        return error;
      }
//    const response =  await openAgent.createCompletion({
//         model:'text-davinci-003',
//         promt: promptGenerator(text),
//         temperature: 0.6,
//     })

 }

const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.get('/', (req,res, next) => res.send("Hello World")  );


app.post("/files", upload.single('file'), async (req,res)=>{
    console.log("Came inside files")
    try {
      if (!req.file) {
        return res.status(400).send('No file uploaded.');
      }
    
      // Access the uploaded file's content from req.file.buffer
      const fileContent = req.file.buffer.toString('utf8');
    
      // You can now work with the file content as needed
      const response = await getCompletion(fileContent);
      console.log("Response", response);
    
      // Respond with a success message or process the file content
      res.status(200).json({response});
    } catch (error) {
      console.log(error);
      res.json({error:true,message:error.message});
    }
  });

app.post('/emailAsBody', async(req, res, next) => {
const resp = await getCompletion(req.body.emailData);
res.status(200).json({
    data: resp
})    ;

} )

app.listen(8080, () => {
    console.log("Server listening on port 8080")

})