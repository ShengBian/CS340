function deleteProgram(id){
    $.ajax({
        url: '/programs/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};