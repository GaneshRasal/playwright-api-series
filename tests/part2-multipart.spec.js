const {test, expect} = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test.describe('Part 2: Multipart File Uploads',{ tag: ['@multipart','@smoke'] },()=> {
  
    test('POST /post - Upload file via multipart/form-data', async ({request}) =>{
       // Setup: Create a temporary dummy file in the project directory
       const filepath = path.join(__dirname,'test-upload.txt');
       fs.writeFileSync(filepath,'Playwright Multipart Upload Test Data!');
      
       const postRes= await request.post('https://httpbin.org/post',{

        multipart:{
            description:'Uploading a test log file',
            // File payload requires name, mimeType, and buffer
            documentFile:{
                name:'test-upload.txt',
                mimeType:'text/plain',
                buffer:fs.readFileSync(filepath)
            }
        }
       });

       expect(postRes.status()).toBe(200);

       const body = await postRes.json();
      console.log('multipart body data',body);

      // Validation: httpbin echoes uploaded files inside the "files" object
      expect(body.files.documentFile).toBe('Playwright Multipart Upload Test Data!');
      // Validation: standard text fields are echoed in the "form" object
      expect(body.form.description).toBe('Uploading a test log file');
      // Teardown: Remove the temporary file to keep the workspace clean
      fs.unlinkSync(filepath);
    });
});