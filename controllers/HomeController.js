exports.Index = function(request, response){
    //response.pageInfo.title = 'Hello World';
    response.render('home/Index', response.pageInfo);
};
 