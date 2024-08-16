/**
 * ===========================================================================================
 * SYSTEM NAME    : next-sns
 * PROGRAM ID     : server/routers/auth.js
 * PROGRAM NAME   : auth.js
 *                : authルーター
 * DEVELOPED BY   : yamabakery
 * CREATE DATE    : 2024/07/01
 * CREATE AUTHOR  : yakoo292929
 * ===========================================================================================
**/

const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const generateIdenticon = require('../utils/generateIdenticon');
require('dotenv').config();

const prisma = new PrismaClient();


/////////////////////////////////////////////////////////
// ユーザー登録 API
/////////////////////////////////////////////////////////
router.post('/register', async(req, res) => {

  // リクエストから取得
  const { username, email, password } = req.body;

  // emailからgenerateIdenticon作成
  const defaultIconImage = generateIdenticon(email);

  // パスワードハッシュ化
  const hashedPassword = await bcrypt.hash(password, 10);

  // DBへユーザー登録
  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      profile: {
        create: {
          bio: 'はじめまして',
          prifileImageUrl: defaultIconImage,
        },
      },
    },
    include: {
      profile: true,
    },
  });

  return res.json({ user });

});


/////////////////////////////////////////////////////////
// ログイン API
/////////////////////////////////////////////////////////
router.post('/login', async(req, res) => {

  // リクエストから取得
  const {email, password} = req.body;

  // DBからユーザー取得
  const user = await prisma.user.findUnique({ where: { email }});

  // ユーザーが存在しない場合
  if (!user) {
      return res.status(401).json({error: "メールアドレスかパスワードが間違っています。"});
  }

  // パスワードが間違っている場合
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
      return res.status(401).json({error: "メールアドレスかパスワードが間違っています。"});
  }

  // トークン作成 保持日：1日
  const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
    expiresIn: "1d",
  });

  return res.json({ token });

});

module.exports = router;
