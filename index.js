
var express =require('express')
var path=require('path')
var helmet=require('helmet')
var router=express()
var methodoverride=require('method-override')
var passport=require('passport')
var Localstrategy=require('passport-local');
var localstrategymongoose =require('passport-local-mongoose')
var bodyParser=require('body-parser')
const cookieParser=require('cookie-parser')
const request=require('request')
router.use(cookieParser())
router.use(methodoverride('_method'))
var ejs=require('ejs')
router.use(express.static('public'))
router.use(express.static(__dirname + '/public'));
router.use(express.json())
router.use(express.urlencoded({extended:false}))
router.use(bodyParser.urlencoded({extended:true}))
router.set('view engine','ejs')
router.set('views',path.join(__dirname,'views'))


router.use(require('express-session')({
secret:'rusty',
resave:false,
saveUninitialized:false
}))

router.use(passport.initialize())
router.use(passport.session())



//passport.serializeUser(campground.session())
//passport.deserializeUser(campground.deserializeUser())

var nowPlayingUrl="http://www.omdbapi.com/?apikey=f637d5ba&s=%27titanic%27"
//http://www.omdbapi.com/?i=tt3896198&apikey=f637d5ba
var mongoose=require('mongoose')
//connect to the DB
mongoose.connect('mongodb://localhost:27017/campgroundDB',{useNewUrlParser:true})
.then(()=>{console.log('connected')})
.catch((err)=>{console.log(err)})
 
var campgroundsschema=new mongoose.Schema({
  // name: String,
  // image:String,
  // description:String
  username:String,
  password:String
})
campgroundsschema.plugin(localstrategymongoose)
var campground=mongoose.model('campgrounds',campgroundsschema)

passport.use(new Localstrategy(campground.authenticate()))
passport.serializeUser(campground.serializeUser())
passport.deserializeUser(campground.serializeUser())

/*
campground.create({
name:'salmon creek',
image:"https://pixabay.com/get/g3002c894297bb99eb7bfbeae42894ecc6fdd1d5050b3c09d065458b95242f7c2f4b52a6aa7d7083a272dca62befdd360_340.png"
},function(err,campground)
{
   if(err)
   {
      console.log(err)
   }
   else{
      console.log('newly created campgrounds')
   }
}y

)
*/

router.put('/campgrounds/:id',function(req,res,next){

campground.findByIdAndUpdate(req.params.id,{name:req.body.image},function(err,update){

if(err){
   res.redirect('/campgrounds')
}
else{
   res.redirect('/campgrounds')
}
   })
  // res.send('put')
})
router.get('/login',function(req,res){

   res.render('login')

})

router.post('/login', passport.authenticate('local', {successRedirect:'/home', failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/welcome');
  });



/*
router.post('/login',passport.authenticate("local",{

   successRedirect:'/secret',
   failureRedirect:'/login'
}),function(req,res){

})
*/
router.get('/logout',function(req,res){
req.logout();
res.redirect('/login')

})


router.get('/register',function(req,res){

  res.render('register')
   
   })
   
router.post('/register',function(req,res){
var newuser=new campground({username:req.body.username})
campground.register(newuser,req.body.password,function(err,user){
if(err)
{
 res.render('register')
}
else{
passport.authenticate('local')(req,res,function()
{
res.redirect('/secret')
 })
}
}) 
})

router.get('/home',function(req,res,next){
   res.render('home')
  })
router.get('/',function(req,res,next){
 res.render('landing')
})

router.get('/campground/:id',function(req,res,next){

   campground.findById(req.params.id,function(err,foundcamp){
if(err)
{
   console.log(err)
}
else{
res.render('show',{campground:foundcamp})
}
   })
     
  })


router.post('/campgrounds/new',function(req,res,next){
       const name=req.body.name
       const image=req.body.image
       const desc=req.body.desc
       const names={name:name,image:image,desc:desc}

       campground.create(names,function(err,newlycreated)
       {
if(err)
{
   console.log(err)
}
else{
        res.redirect('/campgrounds')
}
       })
       
   
})

router.get('/campgrounds/new',function(req,res,next){
    
 res.render('form')
   
})


router.delete('/camp/:id',function(req,res,next){

   //res.send('req.params.id')
   campground.findByIdAndRemove(req.params.id,function(err){

      if(err){
         res.redirect('/campgrounds')
      }
      else{
         res.redirect('/campgrounds')
      }
    })
})
  
 router.get('/campground/:id/edit',function(req,res,next){
   campground.findById(req.params.id,function(err,foundsite){
if(err)
{
   res.send(req.params.id)
}
else{
   res.render('edit',{campground:foundsite})
}

}) 

 })

router.get('/campgrounds',function(req,res,next){
campground.find({},function(err,campground)
{
   if(err){
      console.log(err)
   }
   else{
      res.render('welcome',{
         	campgrounds:campground
      })
   }
}
)

})
router.listen(3000)