var mongoose=require("mongoose")
mongoose.connect("mongodb://localhost/sessiondb");
mongoose.connection.once('open',function()
{
	console.log("con has been made...")
	
}).on("error",function(){
	
	console.log("connection error")
})
const userschema=new mongoose.Schema({
	username:{
		type:String,
		required:true
		
	},
	password:{
		type:String,
		required:true
	} 
})	
var User=mongoose.model("user",userschema)
module.exports=User

