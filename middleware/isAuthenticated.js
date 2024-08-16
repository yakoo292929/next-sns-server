/**
 * ===========================================================================================
 * SYSTEM NAME    : next-sns
 * PROGRAM ID     : server/middleware/isAuthenticated.js
 * PROGRAM NAME   : isAuthenticated.js
 *                : isAuthenticatedミドルウェア
 * DEVELOPED BY   : yamabakery
 * CREATE DATE    : 2024/07/01
 * CREATE AUTHOR  : yakoo292929
 * ===========================================================================================
**/

const jwt = require('jsonwebtoken');  // JSON Web Token (JWT)

/////////////////////////////////////////////
// 認証ミドルウェア
/////////////////////////////////////////////
function isAuthenticated(req, res, next) {

  // リクエストヘッダーよりトークンを取得
  const token = req.headers.authorization?.split(' ')[1];

  // トークンが存在しない時
  if (!token) {
      return res.status(401).json({message: '権限がありません。'});
  }

  // トークン検証
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
        return res.status(401).json({message: '権限がありません。'});
    }

    // ペイロード（デコードされた情報）されたユーザーID保存
    req.userId = decoded.id;

    next();

  });

}

module.exports = isAuthenticated;
