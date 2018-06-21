function deletePayment(id){
    $.ajax({
        url: '/payments/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};