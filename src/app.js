const express = require("express");
const app = express();
const appConfig = require("./config/main-config.js");
const routeConfig = require("./config/route-config.js");
const multer = require('multer');
const path = require('path');

//set storage
const storage = multer.diskStorage({
    destination: './public/uploads',  
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

//init upload
const upload = multer({
    storage: storage,
    limits: {fileSize: 2000000},
    fileFilter: (req, file, cb) => {checkFileType(file, cb)}
}).single('myImage');

//check file type
function checkFileType(file, cb){
    //allowed extensions
    const filetypes = /jpeg|jpg|png|gif/;
    //check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    //check mime
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null, true)
    } else {
        cb('Error: Images Only!');
    }
}

appConfig.init(app, express);
routeConfig.init(app);

app.get('/upload/', (req, res) => res.render('./upload/index.ejs'));
app.post('/upload/create', (req, res) => {
    upload(req, res, (err) => {
        if(err){
            res.render('./upload/index.ejs', {
                msg: err
            });
        } else {
            if(req.file == undefined){
                res.render('./upload/index.ejs', {
                    msg: "Error: No File Selected!"
                });
            } else {
                console.log(req.file.filename)
                res.render('./upload/index.ejs', {
                    msg: 'File Uploaded!',
                    file: req.file.filename
                })
            }
        }
    });
});

module.exports = app;