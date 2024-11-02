const express = require('express');
const path = require('path');
const cors = require('cors');

const apiConfig = require('./config/api');

const router = require('./router');
const getRootPath = require('./utils/get-root-path');
const getUserInfoMiddleware = require('./middleware/getUserInfoMiddleware');
const logMiddleware = require('./middleware/logMiddleware');

const { startAgenda } = require('./cronjob/agenda');

const app = express();

app.use(cors(
    {
        origin: 'http://localhost:5173',
        credentials: true,
    }
));

app.use(express.json());
app.use(express.urlencoded({ extended:true }));
app.use(express.static(path.join(getRootPath(), 'static')));

app.use(getUserInfoMiddleware);
app.use(logMiddleware);

app.use('/api', router);

app.listen(apiConfig.API_PORT, async () => {
    await startAgenda();
    console.log('Listening on port:' + apiConfig.API_PORT);
});
