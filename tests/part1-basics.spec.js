const {test, expect} = require('@playwright/test');
test.describe('Part 1: Playwright Zero-Browser API Fundamentals',() =>{

test('GET /posts/1 - Retrieve single resource', async ({request}) =>{
// 1. Send GET request (uses baseURL from playwright.config.js)

const response = await request.get('/posts/1');
// 1. Status Assertions
expect(response.status()).toBe(200);
expect(response.ok()).toBeTruthy();

// 2. Header Assertions
const header = response.headers();
expect(header['content-type']).toContain('application/json');

// 3. Body Parsing & Assertions
const body =await response.json();
expect(body.id).toBe(1);
expect(typeof body.title).toBe('string');
});

test('GET /posts - Fetch list and validate collection structure', async ({request}) =>{
const response = await request.get('/posts');
expect(response.status()).toBe(200);

const posts =await response.json();
expect(Array.isArray(posts)).toBeTruthy();
expect(posts.length).toBeGreaterThan(0);

// Validate schema of the first item
expect(posts[0]).toMatchObject(
    {
        userId:expect.any(Number),
        id:expect.any(Number),
        title:expect.any(String),
        body:expect.any(String)
    }
)

});

test('POST /posts - Create a new resource with payload', async ({request}) =>{
const newPostPayload={
    title:'Playwright API Testing',
    body:'Zero-browser execution is fast!',
    userId:'430'
};

const response = await request.post('/posts',{
    data:newPostPayload
});
// 201 Created Validation
 expect(response.status()).toBe(201);

 const createdPost = await response.json();
 expect(createdPost.title).toBe(newPostPayload.title);
 expect(createdPost.userId).toBe(newPostPayload.userId);
 expect(createdPost).toHaveProperty('id');
});

test('GET /posts/99999 - Validate 404 Not Found handling', async ({request})=> {
    const response = await request.get('/posts/9999');
    expect(response.status()).toBe(404);
    expect(response.ok()).toBeFalsy();
});
});