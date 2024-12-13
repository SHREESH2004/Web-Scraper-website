const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('views'));
app.set('view engine', 'ejs');

const userModel = require('./models/user');
const dbConnection = require('./config/db');

app.use((req, res, next) => {
    console.log("Global middleware: Request received");
    console.log("App Accessed");
    next();
});

app.get('/profile',
    (req, res, next) => {
        console.log("Profile-specific middleware");
        console.log("Processing /profile route");
        next();
    },
    (req, res) => {
        res.send("Welcome to the Profile page!");
    }
);
app.get('/register', (req, res) => {
    res.render('register');
});
app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        await userModel.create({
            username: username,
            email: email,
            password: password,
        });
        res.send('User successfully registered!');
    } catch (error) {
        console.error('Error during user registration:', error);
        res.status(500).send('Error registering user');
    }
});
app.get('/get-user',(req,res)=>{
    //search database and return
userModel.find({
    //username:b
}).then((users)=>
{
    res.send(users);
})
}
);
app.get('/', (req, res) => {
    res.render('index');
    console.log(`URL accessed: ${req.url}`);
});

app.get('/about', (req, res) => {
    res.render('about');
    console.log(`URL accessed: ${req.url}`);
});

app.post('/get-form-data', (req, res) => {
    console.log(req.body);
    res.send("Form data received successfully!");
});

app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
