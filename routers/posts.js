/**
 * ===========================================================================================
 * SYSTEM NAME    : next-sns
 * PROGRAM ID     : server/routers/posts.js
 * PROGRAM NAME   : posts.js
 *                : postsルーター
 * DEVELOPED BY   : yamabakery
 * CREATE DATE    : 2024/07/01
 * CREATE AUTHOR  : yakoo292929
 * ===========================================================================================
**/

const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const isAuthenticated = require('../middleware/isAuthenticated');
require('dotenv').config();

const prisma = new PrismaClient();


/////////////////////////////////////////////////////////
// 投稿 API
/////////////////////////////////////////////////////////
router.post('/post', isAuthenticated, async(req, res) => {

  // リクエストから取得
  const { content } = req.body;

  // 投稿がない場合
  if (!content) {
      return res.status(400).json({ message: '投稿内容がありません' });
  }

  try {
    // DBへ投稿
    const newPost = await prisma.post.create({
      data: {
        content,
        autherId: req.userId,
      },
      include: {
        auther: {
          include: {
            profile: true,
          }
        },
      },
    });

    res.status(201).json(newPost);

  } catch(err) {
    console.error(err);
    res.status(500).json({ massage: 'サーバーエラー' });
  }

});


/////////////////////////////////////////////////////////
// 投稿一覧取得 API
/////////////////////////////////////////////////////////
router.get('/get_latest_post', async(req, res) => {

  try {
    // DBから投稿一覧取得
    const latestPosts = await prisma.post.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        auther: {
          include: {
            profile: true,
          }
        },
      },
    });
    return res.status(200).json(latestPosts);

  } catch(err) {
    console.error(err);
    res.status(500).json({ massage: 'サーバーエラー' });
  }

});


/////////////////////////////////////////////////////////
// 指定ユーザー投稿一覧取得 API
/////////////////////////////////////////////////////////
router.get('/:userId', async(req, res) => {

  const { userId }  = req.params;

  try {

    // DBから指定ユーザー投稿一覧取得
    const userPosts = await prisma.post.findMany({
      where: {
        autherId: parseInt(userId),
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        auther: true,
      }
    });

    return res.status(200).json(userPosts);

  } catch(err) {
    console.error(err);
    res.status(500).json({ massage: 'サーバーエラー' });
  }

});

module.exports = router;
