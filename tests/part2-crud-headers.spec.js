const {test, expect} = require('@playwright/test');

test.describe('Part 2: Query Params & Headers',{ tag: ['@crud','@smoke'] },()=>{

    test('GET /users - Dynamic Query Params & Headers', async({request}) => {
    const response = await request.get('https://reqres.in/api/users',{
        headers:{
            'Aceept':'application/json'
        },
        params:{
            page:2,
            per_page:3
        }
       });

    expect(response.status()).toBe(200);
    const body = await response.json();
console.log('response',body);
    // Validate that the query parameters actually manipulated the response
    expect(body.page).toBe(2);
    expect(body.per_page).toBe(3);
    expect(body.data).toHaveLength(3);
    });
});

test.describe('CRUD Operations', { tag: ['@crud','@smoke'] }, ()=>{

    test('Execute POST, PUT, and DELETE sequentially', async({request}) => {
      const createPayload = {
          name:'Ganesh Rasal',
          job:'Associate SDET'
      };

      const postRes = await request.post('https://reqres.in/api/users',{
        data:createPayload
      });

      expect(postRes.status()).toBe(201);
     const createData= await postRes.json();
     console.log('createData- ',createData);
     expect(createData.name).toBe('Ganesh Rasal');
     expect(createData.job).toBe('Associate SDET');

     // fetch dynamic id
     const userId = createData.id;
     expect(userId).toBeTruthy();


     // 2. UPDATE (PUT)
     const updatePayload={
        name:'Ganesh Rasal',
        job:'Senior SDET'
     };

    const putRes = await request.put('https://reqres.in/api/users/${userId}',{
       data:updatePayload
    });
    
    expect(putRes.status()).toBe(200);
    const updatedData =await putRes.json();
    console.log('updatedData- ',updatedData);
    expect(updatedData.job).toBe('Senior SDET');

    // 3. DELETE
    const deleteRes = await request.delete('https://reqres.in/api/users/${userId}');
    expect(deleteRes.status()).toBe(204);
    });
});