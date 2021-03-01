var mongoose=require('mongoose')
//connect to the DB
mongoose.connect('mongodb://localhost:27017/demo')
var cats=new mongoose.Schema({
	name:String
})

var demo=mongoose.model('demo',cats)

// adding to the DB
var george=new demo({
	name:'Burnny'
})
// save your data after succesfull connection
george.save(function(err,cat)
{
	if(err)
	{
		console.log('something went wrong')
	}
	else{
		console.log('data inserted',cat)
		
	}
	
})

demo.find({},function(err,cats)
	{
		if(err)
		{
			console.log(err)
		}
		else{
			console.log(cats)
			
		}
		
	})