import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';

const app = express();

const corsOptions = {
    origin: 'http://localhost:4838'
};
const helmetOptions = {
    crossOriginResourcePolicy: false
};

app.use(cors(corsOptions));
app.use(helmet(helmetOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const users = [];

app.post('/api/register', (req, res) => {
    let isUniqueUserEmail = true;

    for (const user of users) {
        if (user.email === req.body.email) {
            isUniqueUserEmail = false;
            break;
        }
    }

    if (isUniqueUserEmail) {
        users.push(req.body);
        console.log(users);

        return res.send(JSON.stringify({
            message: 'User successfully registered'
        }));
    }

    return res.send(JSON.stringify({
        message: 'User already exists'
    }));
});

app.post('/api/login', (req, res) => {
    console.log('LOGIN:', req.body);

    let userExists = false;

    for (const user of users) {
        if (user.email === req.body.email &&
            user.password === req.body.password) {
            userExists = true;
            break;
        }
    }

    if (userExists) {
        return res.send(JSON.stringify({
            message: 'User successfully logged in',
            loggedIn: true,
        }));
    }

    return res.send(JSON.stringify({
        message: 'Such user does not exist',
        loggedIn: false,
    }));
});

app.get('*', (req, res) => {
    console.log('404');
    return res.send('404 - content not found');
});

app.use((req, res, next) => {
    return res.status(404).send("Sorry can't find that!");
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(4838, () => {
    console.log(`\nhttp://localhost:4838`);
});