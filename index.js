const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');
const views = path.join(__dirname, 'views');
const fs = require('fs-extra');
const storage = require('./src/storage.js');
const busboy = require('connect-busboy');
const config = require('./config.js');

//app.use(fileUpload());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(busboy({
        highWaterMark: 2 * 1024 * 1024, // 2MiB buffer
}));
app.set('view engine', 'ejs');

router.use((req, res, next) => {
   console.log("/" + req.method);
   next();
});

// Test Home page
router.get('/', (req, res) => {
   res.render('pages/index');
});

router.get('/about', (req, res) => {
  res.render('pages/about');
});

router.get('/portfolio', (req, res) => {
  res.render('pages/portfolio');
});

router.get('/admin', (req, res) => {
  res.render('pages/admin');
});

router.get('/admin/upload', (req, res) => {
  res.render('pages/admin/upload');
});


router.post('/upload', (req, res) => {
        var s3Path = "";
	var houseName = "";
        req.pipe(req.busboy);
	
	req.busboy.on('field', (fieldname, val) => {
		if (fieldname === "houseName") {
			houseName = val.trim().toLowerCase();
		}
	}).on('file', (fieldname, file, filename, encoding, mimetype) => {
                s3Path = path.join(config.AWS.S3.images, 'houses', houseName, filename);
                storage.uploadFile(file, filename, s3Path);
        }).on('finish', () => {
                res.sendStatus(200);
        });
});


app.use("/", router);

app.use("*", (req, res) => {
   res.render('pages/404');
});

app.listen(3000, () => console.log('Server running on port 3000'))
