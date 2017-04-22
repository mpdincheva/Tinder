var express = require('express');
var multer = require('multer');
var upload = multer({ dest: '/tmp/' });
var router = express.Router();

/* POST saveblog router. */
router.post('/', upload.any(), function (req, res, next) {
    console.log("upload");
    console.log(req.body, 'Body');
    console.log(req.files, 'files');
    res.end();
});

module.exports = router;