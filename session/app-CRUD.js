const express=require('express')
const session=require('express-session')
const bodyparser=require('body-parser')
const expressvalidator=require('express-validator')
const path=require('path')
const app=express()
const User=require('./db.js')
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:false}))
app.use(express.static(path.join(__dirname,'public')))
app.use(expressvalidator({
errorFormatter:function(param,msg,value){
var namespace=param.split('.'),
root=namespace.shift()
,formParam=root;
while(namespace.length){
formParam+='['+namespace.shift()+']';	
}	
return{
param:formParam,
msg:msg,
value:value
}
}	
}))
app.use(function(req,res,next){
	res.locals.errors=null
	next()
})
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
app.use(session({
	resave:false,
	saveUnitialized:false,
	secret:'cats',
	name:'sessionstore',
cookie:{
	secure:true,
	maxAge:1000*60*60*2,
	sameSite:true
}	
}))
app.get('/',function(req,res)
{
	User.find(function(err,data)
		{
		res.render('show',{
		data:data})})
})

app.get('/login',(req,res,next)=>
{
	res.render('login')
})
app.get('/edit/:_id',(req,res,next)=>
{
	var _id=req.params._id
	User.findOne({_id:req.params._id},function(err,data){
	if(err)
	{
		console.log(err)
	}
	res.render('edit',{
		username:data.username,
		_id:_id
	})
})

	
})

app.post('/edit/:_id',(req,res,next)=>
{	
	var id=req.params._id
	User.findById(id,function(err,data)
		{
			if(err)
			{
				return console.log(err)
			}
			else
			{
		data.username=req.body.username
		data.save(function(err){
		if(err) 
		{
			return console.log(err)
		}
		res.redirect('/')
		})
		}
	
})

})



app.get('/delete/:_id',function(req,res){
	
User.findByIdAndRemove({_id:req.params._id},function(err,page){
	if(err)
	{
		console.log(err)
	}
	else{
		console.log('deleted')
		res.redirect('/')
	}


})
})





app.get('/edit/:_id',function(req,res){
	
User.findOne({_id:req.params._id},function(err,page){
	if(err)
	{
		console.log(err)
	}

	res.render('edit',{
		username:username,
		id:page.id
		
	})
})
})




app.post('/login',(req,res,next)=>
{
req.checkBody('username','Username is required').notEmpty();
req.checkBody('password','Password is required').notEmpty();	
var errors=req.validationErrors();
const username=req.body.username
const password=req.body.password
if(errors){
	console.log(errors)
	res.render('login',{
		username:username,
		errors:errors		
	})
	
}
else{
	console.log('success')
const username=req.body.username
const password=req.body.password

	var user=new User({
		username:username,
		password:password
		
	})
	user.save(function(err,data){
		if(err)
		{
			console.log(err)
		}
		else{
			console.log(data)
		}
	})
	
	
console.log(username,password)
res.redirect('/')
}
}
)
app.listen(3000,()=>console.log('connected'))