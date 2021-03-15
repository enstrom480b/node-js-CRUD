var express=require('express')
var path=require('path')
var session=require('express-session')
var expressvalidator=require('express-validator')
var bodyparser=require('body-parser')
var Category=require('./models/category.js')
var fileupload=require('express-fileupload')
var app=express()
var mkdir=require('mkdirp')
var fs=require('fs-extra')
var Product=require('./models/product.js')
var auth=require('./auth')
var isadmin=auth.isadmin
//var pages=require('./routes/pages')
//var adminpages=require('./routes/admin_pages')
var Page=require('./models/db.js')
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())
//global variables
app.locals.errors=null;
//view engine setup
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs')
//set public folder
app.use(express.static(path.join(__dirname,'public')))
//express session middleware
app.use(session({
secret:'cat',
resave:false,
saveUnitilized:true,
cookie:{secure:true}	
}))
app.use(fileupload())
//express validator middleware
/*
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
*/
//express messages
/*
app.use(require('connect-flash')())

app.use(function(req,res,next){
	res.locals.messages=require('express-messages')(req,res)
	next()
	})
app.use(function(req,res,next){
	
	res.locals.messages=require('express-messages')(req,res)
})
*/

//app.use('app.get()/admin/pages',)
app.get('/',isadmin,function(req,res){
	Page.find({}).sort({sorting:1}).exec(function(err,pages){
		res.render('admin',{
			pages:pages
			
		})
		
	})
	
})


//ADD PAGES
app.get('/addpage',function(req,res){
	var title=""
	var slug=""
	var content=""
	
	res.render('add_page',{
		title:title,
		slug:slug,
		content:content
		
	})
})

app.get('/add-product',function(req,res){
	var title=""
	var desc=""
	var price=""
	Category.find(function(err,categories){
	res.render('add-product',{
		title:title,
		desc:desc,
		categories:categories,
		price:price,

	})
	})
})
app.get('/adminproducts',(req,res)=>{
	var count;
	Products.count(function(err,c){
		count=c
	})
	Products.find(function(err,product){
		res.render('product',{
			product:product,
			count:count
		})
		
	})
})

app.post('/add-product',(req,res)=>{

var title=req.body.title
var desc=req.body.desc
var price=req.body.price
var category=req.body.category
var slug=req.body.slug
var price=parseInt(price)
var product=new Product({
	title:title,
	slug:slug,
	desc:desc,
	price:price,
	category:category
	
})
product.save(function(err,data){
	if(err)
	{
		console.log(err)
	}
	else{
		console.log('saved',data)
	}
})
res.redirect('/add-product')
})

app.get('/allproducts',function(req,res){
	Product.find(function(err,product){
		res.render('allproducts',{
			product:product,

		})
	
})
})


app.post('/addpage',function(req,res){
	//req.checkBody('title','title must have a value').notEmpty()
	//req.checkBody('content','content must have a value').notEmpty()
	var title=req.body.title
	var slug=req.body.slug
	var content=req.body.content
	//.replace('/\s+/g','-').toLowerCase()
	//if(slug=='')
	
	//slug=title.replace(/\s+/g,'-').toLowerCase()
	/*
var errors=req.validationErrors()
	if(errors)
	{
	res.render('add_page',{
		errors:errors,
		title:title,
		slug:slug
	})
	
	}
	*/
	//else{
	var page=new Page({
		title:title,
		slug:slug,
		content:content,
		sorting:0
	})
	page.save(function(err){
		if(err) 
		{
			return console.log(err)
		}
		//else{

		//}
	})
		//})
	/*
		app.get('/',function(req,res){
	Page.find({}).sort({sorting:1}).exec(function(err,pages){
		res.render('admin',{
			pages:pages
			
		})
		
	})
	
})
	*/	
		
res.redirect('/')
	//}
})
//END OF ADD PAGES
app.get('/edit-page/:slug',function(req,res){
Page.findOne({slug:req.params.slug},function(err,page){
	if(err)
	{
		console.log(err)
	}

	res.render('edit-page',{
		title:page.title,
		slug:page.slug,
		content:page.content,
		id:page.id
		
	})
})
})
//category page

app.get('/category',function(req,res){
	Category.find(function(err,categories){
		
	if(err)
	{
		return console.log(err)
	}
res.render('category',{
	category:categories
})	
	
	})

})
app.get('/add-category',function(req,res){
var title=""
	res.render('addcategory',{
	title:title
	})
	
})



app.post('/add-category',function(req,res){
	var title=req.body.title
	var slug=req.body.title
	var category=new Category({
		title:title,
	    slug:slug
		
	})
category.save(function(err){
	if(err){
		return console.log(err)
	}
	res.redirect('/category')
	
	
})
	
})



//end of index category page


//page delete
app.get('/delete-page/:id',function(req,res){
	
	Page.findByIdAndRemove(req.params.id,function(err){
		
		if(err)
		{
			return console.log(err)
		}
	
	})
		res.redirect('/')
})

//


//app.use('/',pages)
//psot reorder pages
		app.post('/reorder-pages',function(req,res){
	
	console.log(req.body)
})
		
///post page
app.post('/edit-page/:slug',function(req,res){
	req.checkBody('title','title must have a value').notEmpty()
	req.checkBody('content','content must have a value').notEmpty()
	var title=req.body.title
	var slug=req.body.slug
	var content=req.body.content
	var id=req.body.id
	//.replace('/\s+/g','-').toLowerCase()
	//if(slug=='')
		//slug=title.replace(/\s+/g,'-').toLowerCase()
var errors=req.validationErrors()
	if(errors)
	{
	res.render('edit-page',{
		errors:errors,
		title:title,
		slug:slug
	})
	
	}else{
		Page.findById(id,function(err,page)
		{
			if(err)
			{
				return console.log(err)
				
			}
			else{
			page.title=title
			page.slug=slug
			page.content=content	
			
		page.save(function(err){
		if(err) 
		{
			return console.log(err)
		}
		//res.flash('success','page added')
		res.redirect('/')
		})
			}		
		})
}
})

//edit-category //get & post
app.get('/edit-category/:id',function(req,res){
	
	Category.findById(req.params.id,function(err,category){
		
		if(err)
		{
			return console.log(err)
		}
		res.render('edit-category',{
			title:category.title,
			id:category._id
			
		})
	})
	
})
/*
app.get('/edit-category/:id',function(req,res){
	
	Category.findById(req.params.id,function(err,category){
		
		if(err)
		{
			return console.log(err)
		}
		res.render('edit-category',{
			title:category.title,
			id:category._id
			
		})
	})
	
})
*/
//edit 
	/*
	var page=new Page({
		title:title,
		slug:slug,
		content:content,
		sorting:0
	})
*/	
app.post('/edit-category/:id',function(req,res){

	var title=req.body.title
	var slug=req.body.slug
	var id=req.params.id
var errors=req.validationErrors()
	if(errors)
	{
	res.render('edit-category',{
		title:title,
		id:id
	})
	
	}else{
		Category.findById(id,function(err,cat)
		{
			if(err)
			{
				return console.log(err)
			}
			else
			{
			cat.title=title
			cat.slug=slug
		cat.save(function(err){
		if(err) 
		{
			return console.log(err)
		}
		//res.flash('success','page added')
		res.redirect('/category')
		})
		}		
})
}
})
	
	
	

////end of post page
//post add-category
app.post('/add-category',function(req,res){
	//req.checkBody('title','title must have a value').notEmpty()
	//req.checkBody('content','content must have a value').notEmpty()
	var title=req.body.title
	//.replace('/\s+/g','-').toLowerCase()
	//if(slug=='')
		//slug=title.replace(/\s+/g,'-').toLowerCase()
var errors=req.validationErrors()
	if(errors)
	{
	res.render('add-category',{
		errors:errors,
		title:title,
		slug:slug
	})
	
	}else{
	var category=new Category({
		title:title,
		sorting:0
	})
	category.save(function(err){
		if(err) 
		{
			return console.log(err)
		}
		else{

		}
	})
		//})

		app.get('/',function(req,res){
	Page.find({}).sort({sorting:1}).exec(function(err,pages){
		res.render('admin',{
			pages:pages
			
		})
		
	})
	
})

		
res.redirect('/category')
	}
})
//end of post categories//
//delete page
app.get('/delete-category/:id',function(req,res){
	Category.findByIdAndRemove(req.params.id,function(err){
		if(err)
		{
			return console.log(err)
		}
		
		res.redirect('/category')
		
	})
	
})




//
var port=3000
app.listen(port,function(){
	console.log('server started on port'+port)
})