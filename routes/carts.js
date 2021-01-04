const express = require('express');
const router = express.Router();
const controllerCarts = require('../controllers/controllerCarts')
/* GET home page. */
router.use(express.static('public'));
router.get('/unpaid',controllerCarts.unpaid);
router.get('/delivering',controllerCarts.delivering);
router.get('/finished',controllerCarts.finished);
router.get('/detail', controllerCarts.detail);
router.post('/finish-cart', controllerCarts.finishCart);
router.get('/stat-by-day', controllerCarts.statByDay);
router.get('/stat-by-month', controllerCarts.statByMonth);
router.get('/stat-by-year', controllerCarts.statByYear);
router.get('/stat-by-quarter', controllerCarts.statByQuarter);
module.exports = router;