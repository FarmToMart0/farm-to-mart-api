
function arrangeOrder(order) {
	const outArray = [];
	
    outArray.category = order.category
    outArray.description = order.more_details
    outArray.unitPrice = order.price
    outArray.amount = Number(order.amount)
    outArray.totalPrice = Number(order.totValue)
    // outArray.farmer = order.farmer
    // outArray.product = order.product_name
    // outArray.buyer = order.buyer
    
    outArray.orderStatus = "place"      
    
    
    if(order.address[0].length == 1){
        outArray.deliveryMethod = "farm pickup"
    }else{
        outArray.deliveryMethod = "online delivery"
    }


    if(order.type === "buy"){
        outArray.isFromBidding = false
    }else{
        outArray.isFromBidding = true
    }


    if(order.paymentDetails[0].length == 1){
        outArray.paymentMethod = "cash on delivery"
        outArray.paymentStatus = "notpaid"
    }else{
        outArray.paymentMethod = "online"
        outArray.paymentStatus = "paid"
    }



    return outArray

}

module.exports ={arrangeOrder}
