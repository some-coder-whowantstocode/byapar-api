const {
    addreview,
    getreviewbyproduct,
    removereview
} = require('../controller/reviewcontroller');
const express = require('express');
const router = express.Router();


router.post(
    '/addreview',
    addreview
)

router.get(
    '/getreviewbyproduct/:id',
    getreviewbyproduct
)

router.delete(
    '/removereview/:id',
    removereview
)

module.exports = router;