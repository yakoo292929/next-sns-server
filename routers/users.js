/**
 * ===========================================================================================
 * SYSTEM NAME    : next-sns
 * PROGRAM ID     : server/routers/users.js
 * PROGRAM NAME   : user.js
 *                : userルーター
 * DEVELOPED BY   : yamabakery
 * CREATE DATE    : 2024/07/01
 * CREATE AUTHOR  : yakoo292929
 * ===========================================================================================
**/

const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const isAuthenticated = require('../middleware/isAuthenticated');
require('dotenv').config();

const prisma = new PrismaClient();

/////////////////////////////////////////////////////////
// ユーザー情報取得 API
/////////////////////////////////////////////////////////
router.get('/find', isAuthenticated, async(req, res) => {

  try {
    // DBからユーザー情報取得
    const user = await prisma.user.findUnique({ where: { id: req.userId }} );

    // ユーザーが存在しない場合
    if (!user) {
        res.status(404).json({ message: 'ユーザーが見つかりませんでした。' });
    }

    res.status(200).json({ user: { id: user.id, email: user.email, username: user.username } });

  } catch(err) {
    console.error(err);
    res.status(500).json({ message: 'サーバーエラー' });
  }

});

/////////////////////////////////////////////////////////
// プロフィール情報取得 API
/////////////////////////////////////////////////////////
router.get('/profile/:userId', async(req, res) => {

  const { userId } = req.params;

  try {
    // DBからプロフィール情報取得
    const profile = await prisma.profile.findUnique({
       where: { userId: parseInt(userId)},
       include: {
        user: {
          include: {
            profile: true,
          },
        },
       },
    });

    if (!profile) {
        res.status(404).json({ message: 'プロフィールが見つかりませんでした。' });
    }

    res.status(200).json(profile);

  } catch(err) {
    console.error(err);
    res.status(500).json({ message: 'サーバーエラー' });
  }

});

module.exports = router;

