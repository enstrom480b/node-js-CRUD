
var express =require('express')
var path=require('path')
var router=express()
var methodoverride=require('method-override')
var bodyParser=require('body-parser')
const cookieParser=require('cookie-parser')
const request=require('request')
router.use(cookieParser())
router.use(methodoverride('_method'))
var ejs=require('ejs')
//router.use(express.static(__dirname + '/public'));
router.use(express.json())
router.use(express.urlencoded({extended:false}))
router.use(bodyParser.urlencoded({extended:true}))
router.set('view engine','ejs')
router.set('views',path.join(__dirname,'views'))
const multer=require('multer');
const uuid=require('uuid').v4

const storage=multer.diskStorage({destination:'./public/uploads/',filename:function(req,file,cb){
cb(null,file.filename+'-'+Date.now()+path.extname(file.originalname))
}
})
const upload=multer({storage:storage,
limits: {fileSize: 200 * 1024 * 1024},
fileFilter:function(req,file,cb){
    checkfiletype(file,cb)
}
}).single('images')

function checkfiletype(file,cb){
/*
const filetypes='/jpeg/jpg/png/gif'
const extname=filetypes.test(path.extname(file.originalname).toLowerCase())
const mimetype=filetypes.test(file.mimetype)
if(mimetype && extname)
{
    return cb(null,true)
}
else{
    cb('error:images only')
}

*/
var allowedMimes = ['image/jpeg', 'image/pjpeg', 'image/png'];
if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
} else {
    cb({
        success: false,
        message: 'Invalid file type. Only jpg, png image files are allowed.'
    }, false);
}


}
router.get('/upload',function(req,res){

    res.render('fileupload')
})
router.use(express.static('./public'))
router.post('/upload',function(req,res){




upload(req,res,(err)=>{

if(err){
    res.render('imageupload',{

        msg:'err'
    })

}
else{

    res.render('welcome')
}
})


})
router.listen(5000)