function arrangeMarket(product){
    
    const products = []
    let  type = ""
    let transport = ""
    let payment = ""
    product.forEach(element => {
        
        if (element.biddingEnable == true){
            type = 'bid'
        }else{
            type = 'buy'
        }

        if (element.deliveryOption.length == 2){
            transport = 'Available'
        }else{
            transport = 'Not Available'
        }

        if (element.paymentOption.length == 2){
           payment = 'Available'
        }else{
            payment = 'Not Available'
        }


        products.push({item_id:element._id,product_name:element.productName,price:element.unitPrice,
            type:type, date:element.date, transport:transport,payment:payment,more_details:element.description,image:element.images[0] })
    });


    return products
}

module.exports = {arrangeMarket}