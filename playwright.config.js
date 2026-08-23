const {defineConfig} = require('@playwright/test');

module.exports = defineConfig({
   testDir: './tests',
   /* Timeout per test in milliseconds */
   timeout:30000,
   /* Run tests in files in parallel */
   fullyParallel:true,
   /* Retry on CI only */
   retries:process.env.CI?2:0,
   /* Workers for parallel execution */
   workers:process.env.CI?1:undefined,

   /* HTML Reporter */
   reporter:[
    ['list'],
    ['html',{outputFolder:'playwrightReport',open:'never'}]
   ],

   use:{
    /* Base URL for all API requests */
    baseURL:'https://jsonplaceholder.typicode.com',

    /* Global HTTP Headers */
    extraHeaders:{
        'Accept':'application/json',
        'Content-Type':'application/json; charset=UTF-8'
    }
   }





});