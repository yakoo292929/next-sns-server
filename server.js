/**
 * ===========================================================================================
 * SYSTEM NAME    : next-sns
 * PROGRAM ID     : server/server.js
 * PROGRAM NAME   : server.js
 *                : 起動JavaScript
 * DEVELOPED BY   : yamabakery
 * CREATE DATE    : 2024/07/01
 * CREATE AUTHOR  : yakoo292929
 * ===========================================================================================
**/

const express = require('express');
const app = express();
const authRoute = require('./routers/auth');
const postsRoute = require('./routers/posts');
const usersRoutes = require('./routers/users');
const cors = require('cors');

require('dotenv').config();


/////////////////////////////////////////////////////////
// ミドルウェア
/////////////////////////////////////////////////////////
app.use(cors());
app.use(express.json());


/////////////////////////////////////////////////////////
// ルーター
/////////////////////////////////////////////////////////
app.use('/server/auth', authRoute);
app.use('/server/posts', postsRoute);
app.use('/server/users', usersRoutes);


/////////////////////////////////////////////////////////
// サーバー起動
/////////////////////////////////////////////////////////
const port = process.env.PORT || 5000;
app.listen(port, ()=> {
  console.log(`server is running on Port ${port}`);
});
