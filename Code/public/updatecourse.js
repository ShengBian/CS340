function updateCourse(id){
    $.ajax({
        url: '/courses/' + id,
        type: 'PUT',
        data: $('#update-course').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};