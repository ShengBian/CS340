function updateProgram(id){
    $.ajax({
        url: '/programs/' + id,
        type: 'PUT',
        data: $('#update-program').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};