run command npm i then install dependencies as needed  
 npm run both & go to postman
 call api : http://localhost:5000/api/auth/register
b) pass this as a body :
{
"first_name" : "Anil",
"last_name" : "Upadhyay",
"email" : "anil.upadhyay@gmail.com",
"dob" : "02/07/1999",
"city" : "Varanasi",
"state" : "UttarPradesh",
"password" : "qwerty@cool",
"role" : "1"
},
method : "POST" 5. now go to localhost:3000 6. Login and check the app
