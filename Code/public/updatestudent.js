function updateStudent(id){
    $.ajax({
        url: '/students/' + id,
        type: 'PUT',
        data: $('#update-student').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};