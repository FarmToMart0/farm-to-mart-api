const  firebaseapp =  require('../configs/firebase');
const {ref,set,get,update,remove,child,push} = require("firebase/database");

const _ = require('lodash');


const generateOutput= require('../utils/outputFactory')
const db = firebaseapp.startFirebase()

//methods for making a bid
async function  setBidding(req,res) {

    const bid_item = req.body.bid_item;
    const currnt_bid = req.body.currnt_bid;
    const buyer_id = req.body.buyer_id;
   
    set(ref(db,'bidding/'+bid_item),
    {
      currnt_bid:currnt_bid,
      buyer_id:buyer_id
    }).then(()=>{
      res.status(200).send("succussfully added")
    }).catch((error)=>{
     res.send("faield ")
    })    
}

async function  getBidding(req,res){
  const dbRef = ref(db)
  const bid_item = req.body.order_id;
  
  get(child(dbRef,'bidding/'+bid_item)).then((snapshot)=>{
    if(snapshot.exists()){
      const currnt_bid = snapshot.val().currnt_bid
      const buyer_id = snapshot.val().buyer_id
      const arry = {currnt_bid,buyer_id}
      res.send(arry)
    }else{
      res.send("No data")
    }
  })

}

async function pushNotification(req,res) {
  
  const id = req.body.id
  const mes= req.body.message
  console.log(id,mes)
  const notoficationData = {
    message: mes,
    seen:false,
    date: Date.now(),
    
  };

  // Get a key for a new Post.
  const newKey = push(child(ref(db), 'notification')).key;
    
    set(ref(db,'notification/'+id+'/'+newKey),
    notoficationData).then(()=>{
      res.status(200).send("succussfully added")
    }).catch((error)=>{
     res.send("faield ")
    })    
}


module.exports ={setBidding,getBidding,pushNotification};