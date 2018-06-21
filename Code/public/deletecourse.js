function deleteCourse(id){
    $.ajax({
        url: '/courses/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};