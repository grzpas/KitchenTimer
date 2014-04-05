  $(document).ready(function(){
 
    document.addEventListener("deviceready", onDeviceReady, false);
     
    var db = window.openDatabase("Database", "1.0", "Timer", 200000);
 
    function onDeviceReady(){
        //Populate the databse
        db.transaction(populateDB, errorCB, successCB);
        //Override the back button functionality
        document.addEventListener('backbutton', onBack, false);
     
    }
     
    function onBack(){
        //If the current page is index page then exit other wise navigate to index page
        if($.mobile.activePage.is('#index')){
            navigator.app.exitApp();  
        }
        else{
            db.transaction(queryDB, errorCB);
        }
    }              
 
    function populateDB(tx){
        //Create the table
        //tx.executeSql('DROP TABLE IF EXISTS Timer');
        tx.executeSql('CREATE TABLE IF NOT EXISTS Timer (id INTEGER PRIMARY KEY AUTOINCREMENT, \
                		name TEXT NOT NULL, hour INT, second INT, \
        				minute INT, src TEXT)\
        ');
        tx.executeSql('SELECT id, name, hour, minute, second FROM Timer ORDER BY name', [], querySuccess, errorCB);
      
    }
 
    function successCB(){
      
        db.transaction(queryDB, errorCB);


    }
 
    function queryDB(tx){
        tx.executeSql('SELECT id, name, hour, minute, second FROM Timer ORDER BY name', [], querySuccess, errorCB);
    }
 
    function querySuccess(tx, results){
        $.mobile.showPageLoadingMsg(true);
        var len = results.rows.length;
        $("#userList").html('');
        for (var i=0; i<len; i++){
            var row= results.rows.item(i);
            var htmlData = '<li id="'+row["id"]+'"><a href="#"><h2>'+row["name"]+'</h2><p class="ui-li-aside">'+row["hour"]+':'+row["minute"]+':'+row["second"]+'</p></a></li>';
            $("#userList").append(htmlData).listview('refresh');
        }
        $.mobile.changePage($("#index"), { transition : "slide"});
        $.mobile.hidePageLoadingMsg();
    }
 
    function errorCB(err){

    	  alert('dupa');
    }      
 
    $("#addNewPage .error").html('').hide();
 
    $(".addNew").bind ("click", function (event){
        $("#addNewPage .error").html('').hide();
        $.mobile.changePage ($("#addNewPage"), { transition : "slide", reverse : true });
        $("#addNewPageHeader").html("Add New");
    });
 
    $("#save").bind ("click", function (event){
        var name = $.trim($("#name").val()).replace(/[^A-Za-z0-9 ]/g, '');
        var hour = $.trim($("#hour").val()).replace(/[^0-9-]/g, '');
        var second = $.trim($("#second").val()).replace(/[^0-9-]/g, '');
        var minute = $.trim($("#minute").val()).replace(/[^0-9-]/g, '');
        var src = $.trim($("#src").val());
      
        console.log(name+' '+hour+' '+second+' '+minute+' '+src);
 
        if (name == ''){
            $("#addNewPage .error").html('Please enter name.').show();
        }
        else{
            resetForm();
 			var id = $("#id").val();
            $("#id").val('');
            if (id == ''){  //Save
                db.transaction(function (tx){ tx.executeSql("INSERT INTO Timer (name, hour, second, minute, src) VALUES  (?, ?, ?, ?, ?)",[name, hour, second, minute, src],
                queryDB, errorCB); }); 
            }
            else{   //Update
                db.transaction(function (tx){ tx.executeSql("UPDATE Timer SET name=?, hour=?, second=?, minute=?, src=? WHERE id=? ",[name, hour, second, minute, src, id],
                queryDB, errorCB); }); 
            }
            db.transaction(queryDB, errorCB);
        }
    });
     
    $(".refresh").bind("click", function (event){
        db.transaction(queryDB, errorCB);
    });
     
    $(".back").bind("click", function (event){
        resetForm();
        db.transaction(queryDB, errorCB);
    });
     
    function resetForm(){
        $("#addNewPage .error").html('').hide();
        $("#addNewPage #name").val('');
        $("#addNewPage #hour").val('');
        $("#addNewPage #second").val('');
        $("#addNewPage #minute").val('');
        $("#addNewPage #src").val('');
        $("#addNewPage #addNewPageHeader").html('');   
    }
     
    $("#index [data-role='content'] ul").on('tap taphold', 'li', function (event){
        event.preventDefault();
        event.stopImmediatePropagation();
        var liId = this.id;
        if (event.type === 'taphold'){
            navigator.notification.vibrate(30);
            var $popup = $('#actionList-popup');
            $("#actionList").html('');
            $("#actionList").append('<li id="edit&'+liId+'">Edit</li>').listview('refresh');
            $("#actionList").append('<li id="delete&'+liId+'">Delete</li>').listview('refresh');
            $popup.popup();
            $popup.popup('open');
            $("#tapHoldCheck").val('true');
        }
        else if (event.type === 'tap'){
            if ($("#tapHoldCheck").val() == ''){ //If the value of the text box is blank then only tap will work
                db.transaction(function (tx){
                    tx.executeSql("SELECT name, hour, second, minute, src FROM Timer WHERE id=?;", [liId], function (tx, results){
                        var row = results.rows.item(0);
                        $.mobile.showPageLoadingMsg(true);
                        $.mobile.changePage($("#displayDataPage"), { transition : "slide"});
                        $("#nameHeader").html(row['name']);
                        $("#dataName").html(row['name']);
                        $("#dataHour").html(row['hour']);
                        $("#dataSecond").html(row['second']);
                        $("#dataSrc").html(row['src']);
                        $('#dataList').trigger('create');
                        $('#dataList').listview('refresh');
                        $.mobile.hidePageLoadingMsg();
                    });
                 });
            }
        }
    });
 
    //Change the hidden field value when the popup is closed
    $('#actionList-popup').bind({
        popupafterclose: function(event, ui){
            $("#tapHoldCheck").val('');
        }
    });
 
    $("#index [data-role='popup'] ul").on('click', 'li', function (event){
        var action_liId = this.id.split('&');
        var action = action_liId[0];
        var id = action_liId[1];
        if (action == 'edit'){
            db.transaction(function (tx){
                tx.executeSql("SELECT name, hour, second, minute, src FROM Timer WHERE id=?;", [id], function (tx, results){
                    var row = results.rows.item(0);
                    $("#name").val(row['name']);
                    $("#hour").val(row['hour']);
                    $("#second").val(row['second']);
                    $("#minute").val(row['minute']);
                    $("#src").val(row['src']);
                    $("#id").val(id);
                    $("#addNewPageHeader").html('Edit');
                    $.mobile.changePage ($("#addNewPage"), { transition : "slide", reverse : true });
                });
             });
        }
        if (action == 'delete'){
            navigator.notification.confirm(
                'Are you sure?',
                function(buttonIndex){onConfirm(buttonIndex, id);},
                'Delete Contact',
                'Ok, Cancel'
            );
        }
    });
     
    function onConfirm(buttonIndex, id){
        if (buttonIndex === 1){ //Delete
            db.transaction(function (tx){ tx.executeSql("DELETE FROM Timer WHERE id=?", [id], queryDB, errorCB); });
        }
        if (buttonIndex === 2){
            $.mobile.changePage($("#index"), { transition : "slide"});
        }
    }
 
});