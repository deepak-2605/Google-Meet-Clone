function rendertime(){
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    console.log(time);
    setTimeout(rendertime(),1000);
    }
    