function updatePayment(id){
    $.ajax({
        url: '/payments/' + id,
        type: 'PUT',
        data: $('#update-payment').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};